import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [WishlistController],
})
export class WishlistModule {}
