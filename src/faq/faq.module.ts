import { Module } from '@nestjs/common';
// import { FaqController } from './faq.controller';
import { FaqGatewayController } from './faq.controller';

@Module({
  controllers: [FaqGatewayController],
})
export class FaqModule {}
