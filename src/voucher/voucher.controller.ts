import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/vouchers')
export class VoucherController {
  private voucherServiceClient: ClientProxy;

  constructor() {
    this.voucherServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3001 }, // Sesuaikan dengan konfigurasi microservice
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('active-not-purchased')
  async getActiveAndNotPurchasedVouchers(
    @Req() req: any,
    @Query('storeId') storeId: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'getActiveAndNotPurchased' },
        { userId, storeId },
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

  @UseGuards(JwtAuthGuard)
  @Get('purchased-not-used/')
  async findPurchasedAndNotUsedVouchers(
    @Req() req: any,
    @Query('storeId') storeId: string,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'findPurchasedAndNotUsedVouchers' },
        { userId, storeId },
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

  @UseGuards(JwtAuthGuard)
  @Get('applicable')
  async getApplicableVouchers(
    @Req() req: any,
    @Query('storeId') storeId: string,
    @Query('transactionAmount') transactionAmount: number,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'getApplicableVouchers' },
        { userId, storeId, transactionAmount },
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

  @UseGuards(JwtAuthGuard)
  @Get('not-applicable')
  async getNotApplicableVouchers(
    @Req() req: any,
    @Query('storeId') storeId: string,
    @Query('transactionAmount') transactionAmount: number,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'getNotApplicableVouchers' },
        { userId, storeId, transactionAmount },
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

  @Get()
  async findAll(): Promise<any> {
    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'findAll' },
        {},
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

  @Get(':id')
  async findOneById(@Param('id') voucher_id: string): Promise<any> {
    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'findOneById' },
        { voucher_id },
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

  @Post()
  async create(@Body() request: any): Promise<any> {
    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'create' },
        request,
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

  @Put(':voucher_id')
  async update(
    @Param('voucher_id') voucher_id: string,
    @Body() request: any,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher', action: 'update' },
        { voucher_id, ...request },
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

  @UseGuards(JwtAuthGuard)
  @Post(':voucherId/purchase')
  async purchaseVoucher(
    @Req() req: any,
    @Param('voucherId') voucherId: string,
    @Body('storeId') storeId: string,
  ): Promise<any> {
    console.log('yuk beli!');
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.voucherServiceClient.send(
        { module: 'voucher-own', action: 'purchaseVoucher' },
        { userId, voucherId, storeId },
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
}
