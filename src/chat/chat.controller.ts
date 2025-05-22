// chat.controller.ts (API Gateway)
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ChatGateway } from './chat.gateway';

@Controller('/api/chat')
export class ChatController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
    private readonly chatGateway: ChatGateway,
  ) {}

  // Get conversation list untuk user
  @Get('conversations/user/:userId')
  async getUserConversations(@Param('userId') userId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'chat', action: 'getUserConversations' },
        { userId },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }

  // Get conversation list untuk store
  @Get('conversations/store/:storeId')
  async getStoreConversations(@Param('storeId') storeId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'chat', action: 'getStoreConversations' },
        { storeId },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }

  // Send message
  @Post('messages')
  async sendMessage(
    @Body('user_id') userId: string,
    @Body('store_id') storeId: string,
    @Body('sender_id') senderId: string,
    @Body('sender_type') senderType: string, // 'user' atau 'store'
    @Body('content') content: string,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'chat', action: 'sendMessage' },
        { userId, storeId, senderId, senderType, content },
      ),
    );
    this.chatGateway.emitNewMessage(userId, storeId, result.data);
    this.chatGateway.emitConversationUpdate(userId, storeId);

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }

  // Get messages dalam conversation
  @Get('conversations/:userId/:storeId/messages')
  async getMessages(
    @Param('userId') userId: string,
    @Param('storeId') storeId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'chat', action: 'getMessages' },
        { userId, storeId, page, limit },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || 500,
      );
    }

    return result;
  }
}
