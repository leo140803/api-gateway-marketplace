import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('/api/dashboard')
export class DashboardController {
  constructor(
    @Inject('MARKETPLACE') private readonly marketplaceClient: ClientProxy,
  ) {}

  @Get()
  async getReport(): Promise<any> {
    return this.marketplaceClient
      .send({ module: 'dashboard', action: 'getReportData' }, {})
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

    return this.marketplaceClient
      .send({ module: 'storeReport', action: 'getStoreReport' }, storeId)
      .toPromise();
  }
}
