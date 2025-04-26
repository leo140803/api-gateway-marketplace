import { Module } from '@nestjs/common';
import { MidtransController } from './midtrans.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION',
        transport: Transport.TCP,
        options: {
          port: Number(process.env.TRANSACTION_TCP_PORT) || 3005,
        },
      },
    ]),
    SharedModule,
  ],
  controllers: [MidtransController],
})
export class MidtransModule {}
