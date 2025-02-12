import { Module } from '@nestjs/common';
import { StoreController } from './store.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [StoreController],
})
export class StoreModule {}
