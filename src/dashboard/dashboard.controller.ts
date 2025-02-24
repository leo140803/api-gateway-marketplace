import { Controller, Get, Inject } from '@nestjs/common';
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
}
