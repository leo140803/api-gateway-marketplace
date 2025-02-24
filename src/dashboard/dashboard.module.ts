import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [DashboardController],
})
export class DashboardModule {}
