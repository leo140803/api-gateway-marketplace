import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [VoucherController],
})
export class VoucherModule {}
