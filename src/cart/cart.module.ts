import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [CartController],
})
export class CartModule {}
