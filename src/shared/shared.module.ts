import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MARKETPLACE',
        transport: Transport.TCP,
        options: {
          host: process.env.MARKETPLACE_TCP_HOST || '127.0.0.1',
          port: Number(process.env.MARKETPLACE_TCP_PORT) || 3010,
        },
      },
      {
        name: 'TRANSACTION',
        transport: Transport.TCP,
        options: {
          port: Number(process.env.TRANSACTION_TCP_PORT) || 3005,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}
