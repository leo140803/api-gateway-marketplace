import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/poin-history')
export class PoinHistoryController {
  private poinHistoryServiceClient: ClientProxy;

  constructor() {
    this.poinHistoryServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3010 }, // Sesuaikan dengan konfigurasi microservice
    });
  }

  @Post()
  async create(@Body() data: any): Promise<any> {
    const result = await firstValueFrom(
      this.poinHistoryServiceClient.send(
        { module: 'poin-history', action: 'create' },
        data,
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }

  @Get('/:store_id')
  @UseGuards(JwtAuthGuard)
  async findByCustomer(
    @Param('store_id') storeId: string,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.poinHistoryServiceClient.send(
        { module: 'poin-history', action: 'findByCustomer' },
        { userId, storeId },
      ),
    );
    if (!result.success) {
      console.log(result);
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }
}
