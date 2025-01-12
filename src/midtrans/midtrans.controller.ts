import {
  Controller,
  HttpCode,
  Res,
  Query,
  Get,
  HttpException,
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
  private midtransServiceClient: ClientProxy;

  constructor() {
    this.midtransServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3001 }, // Adjust with microservice configuration
    });
  }

  @Get('notification')
  @HttpCode(200)
  async handleGetNotification(@Query() query: any, @Res() res: Response) {
    try {
      console.log('Notification received from Midtrans (GET):', query);

      // Forward request to microservice
      const result = await firstValueFrom(
        this.midtransServiceClient.send(
          { module: 'midtrans', action: 'handleNotification' },
          query,
        ),
      );

      // Handle response from microservice
      if (result.success) {
        return res.redirect(result.redirectUrl);
      } else {
        throw new HttpException(
          result.message || 'Internal Server Error',
          result.statusCode || 500,
        );
      }
    } catch (error) {
      console.error(
        'Error handling Midtrans notification in API Gateway:',
        error,
      );
      res.status(500).send('Internal Server Error');
    }
  }
}
