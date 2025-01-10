import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private marketplaceClient: ClientProxy;
  constructor(private readonly appService: AppService) {
    this.marketplaceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '0.0.0.0', port: 3001 },
    });
  }

  @Get(':service/:module/:action')
  async handleServiceRequest(
    @Param('service') service: string, // Nama service (contoh: marketplace, goldprice)
    @Param('module') module: string, // Modul di dalam service (contoh: goldprice)
    @Param('action') action: string, // Aksi yang diminta (contoh: findAll, findPriceNow)
    @Query() query: Record<string, any>, // Query parameters untuk payload
  ): Promise<any> {
    console.log('Metadata sent to service:', { service, module, action });
    const payload = { ...query }; // Kirimkan query sebagai payload
    console.log('Payload:', payload);
    // Kirim metadata lengkap dengan service, module, dan action
    return this.marketplaceClient
      .send({ service, module, action }, payload)
      .toPromise();
  }
}
