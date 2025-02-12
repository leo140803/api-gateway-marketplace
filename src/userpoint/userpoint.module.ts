import { Module } from '@nestjs/common';
import { UserPointController } from './userpoint.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [UserPointController],
})
export class UserpointModule {}
