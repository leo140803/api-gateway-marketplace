import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ProductController],
})
export class ProductModule {}
