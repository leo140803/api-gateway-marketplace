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
  Inject,
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
  constructor(
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('active-not-purchased')
  async getActiveAndNotPurchasedVouchers(
    @Req() req: any,
    @Query('storeId') storeId: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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

  @UseGuards(JwtAuthGuard)
  @Post(':voucherId/purchase')
  async purchaseVoucher(
    @Req() req: any,
    @Param('voucherId') voucherId: string,
  ): Promise<any> {
    console.log('yuk beli!');
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'voucher-own', action: 'purchaseVoucher' },
        { userId, voucherId },
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
