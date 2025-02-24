import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FaqModule } from './faq/faq.module';
import { FaqGatewayController } from './faq/faq.controller';
import { ConfigModule } from '@nestjs/config';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { GatewayErrorFilter } from './error/error.filter';
import { FollowModule } from './follow/follow.module';
import { MidtransModule } from './midtrans/midtrans.module';
import { GoldpriceModule } from './goldprice/goldprice.module';
import { UserpointModule } from './userpoint/userpoint.module';
import { PointhistoryModule } from './pointhistory/pointhistory.module';
import { VoucherModule } from './voucher/voucher.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { TypesModule } from './types/types.module';
import { TransactionModule } from './transaction/transaction.module';
import { ReviewModule } from './review/review.module';
import { SharedModule } from './shared/shared.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    FaqModule,
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available globally
    }),
    StoreModule,
    AuthModule,
    FollowModule,
    MidtransModule,
    GoldpriceModule,
    UserpointModule,
    PointhistoryModule,
    VoucherModule,
    ProductModule,
    CartModule,
    TypesModule,
    TransactionModule,
    ReviewModule,
    SharedModule,
    WishlistModule,
    DashboardModule,
  ],
  controllers: [AppController, FaqGatewayController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GatewayErrorFilter,
    },
  ],
})
export class AppModule {}
