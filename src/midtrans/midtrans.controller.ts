import {
  Controller,
  HttpCode,
  Res,
  Query,
  Get,
  HttpException,
  Inject,
  Post,
  Headers,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Controller('api/midtrans')
export class MidtransController {
  constructor(
    @Inject('TRANSACTION') private readonly transactionClient: ClientProxy,
  ) {}

  //
  @Post('notification')
  @HttpCode(200)
  async handleTripayNotification(
    @Headers('x-callback-signature') callbackSignature: string,
    @Headers('x-callback-event') callbackEvent: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    try {
      console.log('Tripay Notification Received:', JSON.stringify(body));

      const privateKey = 'NV5zw-d5a2P-7WeT0-6D1ij-jSPxj'; // Tripay Private Key
      const jsonString = JSON.stringify(body);

      const expectedSignature = crypto
        .createHmac('sha256', privateKey)
        .update(jsonString)
        .digest('hex');

      // 1. Validate Signature
      if (callbackSignature !== expectedSignature) {
        console.error('Invalid Signature from Tripay!');
        return res
          .status(400)
          .json({ success: false, message: 'Invalid signature' });
      }

      // 2. Validate Event Type
      if (callbackEvent !== 'payment_status') {
        console.error('Unknown Callback Event:', callbackEvent);
        return res
          .status(400)
          .json({ success: false, message: 'Invalid callback event' });
      }

      console.log('NOTIFICATION: ' + body);

      // 3. Process Notification
      const result = await this.transactionClient
        .send({ module: 'transaction', action: 'notificationTripay' }, body)
        .toPromise();

      if (result.success) {
        return res.json({ success: true });
      } else {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);
      console.error('Error Handling Tripay Notification:', error.message);
      return res
        .status(500)
        .json({ success: false, message: 'Internal Server Error' });
    }
  }
}
