import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('/api/dashboard')
export class DashboardController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
  ) {}

  @Get()
  async getReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.marketplaceWriterClient
      .send(
        { module: 'dashboard', action: 'getReportData' },
        { startDate, endDate },
      )
      .toPromise();
  }

  @Get('/store')
  async getStoreReport(@Query('store_id') storeId: string): Promise<any> {
    if (!storeId) {
      return {
        success: false,
        message: 'store_id is required',
        statusCode: 400,
      };
    }

    return this.marketplaceWriterClient
      .send({ module: 'storeReport', action: 'getStoreReport' }, storeId)
      .toPromise();
  }
}
