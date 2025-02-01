import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/transactions')
export class TransactionController {
  private transactionServiceClient: ClientProxy;

  constructor() {
    this.transactionServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3010 },
    });
  }

  @Get(':id')
  async getTransactionById(@Param('id') id: string): Promise<any> {
    const result = await firstValueFrom(
      this.transactionServiceClient.send(
        { module: 'transaction', action: 'getTransactionById' },
        { id },
      ),
    );

    console.log(result);
    if (!result.success) {
      throw new HttpException(
        {
          success: result.success || false,
          message: result.message || 'Internal Server Error',
        },
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Get('/')
  async getTransactionByPaymentStatus(
    @Query('payment_status') paymentStatus: number,
  ): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.transactionServiceClient.send(
          { module: 'transaction', action: 'getTransactionByPaymentStatus' },
          { payment_status: paymentStatus },
        ),
      );

      if (!result.success) {
        throw new HttpException(
          {
            success: result.success || false,
            message: result.message || 'Internal Server Error',
            errors: result.errors || [],
          },
          result.statusCode || 500,
        );
      }

      return result;
    } catch (error) {
      console.error(
        'Error in API Gateway (getTransactionByPaymentStatus):',
        error,
      );
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Internal Server Error',
          errors: error.errors || [],
        },
        error.statusCode || 500,
      );
    }
  }

  @Post('/')
  async createTransactionWithItems(@Body() data: any) {
    try {
      const result = await firstValueFrom(
        this.transactionServiceClient.send(
          { module: 'transaction', action: 'createTransactionWithItems' },
          data,
        ),
      );

      if (!result.success) {
        throw new HttpException(
          {
            success: result.success || false,
            message: result.message || 'Internal Server Error',
            errors: result.errors || [],
          },
          result.statusCode || 500,
        );
      }

      return result;
    } catch (error) {
      console.error(
        'Error in API Gateway (createTransactionWithItems):',
        error,
      );
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Internal Server Error',
          errors: error.errors || [],
        },
        error.statusCode || 500,
      );
    }
  }

  @Post('/init-transaction')
  async createTransaction(@Body() body: any): Promise<any> {
    try {
      // Kirim permintaan ke Midtrans service
      const result = await firstValueFrom(
        this.transactionServiceClient.send(
          { module: 'midtrans', action: 'initTransaction' },
          body,
        ),
      );

      // Jika gagal, kembalikan error
      if (!result.success) {
        throw new HttpException(
          {
            success: false,
            message: result.message || 'Failed to create transaction',
          },
          result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Kembalikan hasil sukses
      return {
        success: true,
        message: 'Transaction initialized successfully',
        data: result.data,
      };
    } catch (error) {
      console.error('Error in API Gateway (createTransaction):', error.message);
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Failed to create transaction',
        },
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
