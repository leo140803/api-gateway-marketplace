import { Module } from '@nestjs/common';
import { GoldpriceController } from './goldprice.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [GoldpriceController],
})
export class GoldpriceModule {}
