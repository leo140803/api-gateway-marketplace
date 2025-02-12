import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TransactionController],
})
export class TransactionModule {}
