import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [ReviewController],
})
export class ReviewModule {}
