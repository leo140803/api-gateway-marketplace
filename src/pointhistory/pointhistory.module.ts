import { Module } from '@nestjs/common';
import { PoinHistoryController } from './pointhistory.controller';
import { SharedModule } from 'src/shared/shared.module';
@Module({
  imports: [SharedModule],
  controllers: [PoinHistoryController],
})
export class PointhistoryModule {}
