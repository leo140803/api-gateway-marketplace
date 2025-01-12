import { Module } from '@nestjs/common';
import { PoinHistoryController } from './pointhistory.controller';
@Module({
  controllers: [PoinHistoryController],
})
export class PointhistoryModule {}
