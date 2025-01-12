import { Module } from '@nestjs/common';
import { UserPointController } from './userpoint.controller';

@Module({
  controllers: [UserPointController],
})
export class UserpointModule {}
