import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [TypesController],
})
export class TypesModule {}
