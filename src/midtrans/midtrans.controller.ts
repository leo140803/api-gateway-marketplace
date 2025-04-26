import {
  Controller,
  HttpCode,
  Res,
  Query,
  Get,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('api/midtrans')
export class MidtransController {
  constructor(
    @Inject('TRANSACTION') private readonly transactionClient: ClientProxy,
  ) {}

  //
  @Get('notification')
  @HttpCode(200)
  async handleGetNotification(@Query() query: any, @Res() res: Response) {
    try {
      console.log('Notification received from Midtrans (GET):', query);
      const result = await firstValueFrom(
        this.transactionClient.send(
          {
            module: 'transaction',
            action: 'notificationMidtrans',
          },
          query,
        ),
      );
      if (result.success) {
        return res.redirect(result.redirectUrl);
      }

      // Forward request to microservice
      // const result = await firstValueFrom(
      //   this.midtransServiceClient.send(
      //     { module: 'midtrans', action: 'handleNotification' },
      //     query,
      //   ),
      // );

      // // Handle response from microservice
      // if (result.success) {
      //   return res.redirect(result.redirectUrl);
      // } else {
      //   throw new HttpException(
      //     result.message || 'Internal Server Error',
      //     result.statusCode || 500,
      //   );
      // }
    } catch (error) {
      console.error(
        'Error handling Midtrans notification in API Gateway:',
        error,
      );
      res.status(500).send('Internal Server Error');
    }
  }
}
