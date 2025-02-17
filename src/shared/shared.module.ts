import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'MARKETPLACE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3010,
        },
      },
      {
        name: 'TRANSACTION',
        transport: Transport.TCP,
        options: {
          port: 3004,
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}
