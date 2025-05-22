import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [SharedModule],
  controllers: [ChatController],
  providers: [ChatGateway],
  exports: [ChatGateway],
})
export class ChatModule {}
