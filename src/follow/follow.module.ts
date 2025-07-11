import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [FollowController],
})
export class FollowModule {}
