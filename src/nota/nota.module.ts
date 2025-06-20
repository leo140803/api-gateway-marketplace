import { Module } from '@nestjs/common';
import { NotaController } from './nota.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  controllers: [NotaController],
  imports: [SharedModule],
})
export class NotaModule {}
