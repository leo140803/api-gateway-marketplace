import { Controller, Get, HttpException, Inject } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/goldprice')
export class GoldpriceController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.marketplaceReaderClient.send(
          { service: 'marketplace', module: 'goldprice', action: 'findAll' },
          {},
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
      console.error('Error in API Gateway (findAll):', error);
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

  @Get('/now')
  async findPriceNow(): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.marketplaceReaderClient.send(
          {
            service: 'marketplace',
            module: 'goldprice',
            action: 'findPriceNow',
          },
          {},
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
      console.error('Error in API Gateway (findPriceNow):', error);
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

  @Get('/historical')
  async findHistoricalData(): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.marketplaceReaderClient.send(
          {
            service: 'marketplace',
            module: 'goldprice',
            action: 'getHistoricalData',
          },
          {},
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
      console.error('Error in API Gateway (findHistoricalData):', error);
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
}
