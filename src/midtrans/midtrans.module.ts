import { Module } from '@nestjs/common';
import { MidtransController } from './midtrans.controller';

@Module({
  controllers: [MidtransController]
})
export class MidtransModule {}
