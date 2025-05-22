// chat.gateway.ts (WebSocket Gateway untuk Real-time)
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

interface ChatSocket extends Socket {
  userId?: string;
  userType?: 'user' | 'store';
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('ChatGateway');

  async handleConnection(client: ChatSocket) {
    try {
      // Ambil user info dari query parameters
      const userId = client.handshake.query?.userId as string;
      const userType = client.handshake.query?.userType as string;

      if (!userId || !userType) {
        client.disconnect();
        return;
      }

      client.userId = userId;
      client.userType = userType as 'user' | 'store';

      // Join room berdasarkan userType
      if (userType === 'user') {
        client.join(`user_${userId}`);
      } else if (userType === 'store') {
        client.join(`store_${userId}`);
      }

      this.logger.log(`User ${userId} (${userType}) connected`);
    } catch (error) {
      this.logger.error(`Connection error: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: ChatSocket) {
    if (client.userId) {
      this.logger.log(`User ${client.userId} disconnected`);
    }
  }

  // Join conversation room untuk real-time chat
  @SubscribeMessage('join_chat')
  handleJoinChat(
    @MessageBody() data: { userId: string; storeId: string },
    @ConnectedSocket() client: ChatSocket,
  ) {
    const roomName = `chat_${data.userId}_${data.storeId}`;
    client.join(roomName);
    client.emit('joined_chat', { room: roomName });
    this.logger.log(`User ${client.userId} joined chat room: ${roomName}`);
  }

  @SubscribeMessage('leave_chat')
  handleLeaveChat(
    @MessageBody() data: { userId: string; storeId: string },
    @ConnectedSocket() client: ChatSocket,
  ) {
    const roomName = `chat_${data.userId}_${data.storeId}`;
    client.leave(roomName);
    client.emit('left_chat', { room: roomName });
  }

  // Method untuk emit message ke room tertentu (dipanggil dari service)
  emitNewMessage(userId: string, storeId: string, message: any) {
    console.log('new message ' + message);
    const roomName = `chat_${userId}_${storeId}`;
    this.server.to(roomName).emit('new_message', message);

    // Emit ke personal rooms juga untuk notification
    this.server.to(`user_${userId}`).emit('message_notification', {
      storeId,
      message,
    });
    this.server.to(`store_${storeId}`).emit('message_notification', {
      userId,
      message,
    });
  }

  // Method untuk emit conversation list update
  emitConversationUpdate(userId: string, storeId: string) {
    this.server.to(`user_${userId}`).emit('conversation_updated');
    this.server.to(`store_${storeId}`).emit('conversation_updated');
  }
}
