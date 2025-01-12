import { Module } from '@nestjs/common';
import { GoldpriceController } from './goldprice.controller';

@Module({
  controllers: [GoldpriceController]
})
export class GoldpriceModule {}
