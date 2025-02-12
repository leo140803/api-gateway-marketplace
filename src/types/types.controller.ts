import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/types')
export class TypesController {
  constructor(
    @Inject('MARKETPLACE') private readonly typeServiceClient: ClientProxy,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.typeServiceClient.send({ module: 'type', action: 'findAll' }, {}),
      );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.typeServiceClient.send(
          { module: 'type', action: 'findById' },
          { id },
        ),
      );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body() data: { name: string; purity: string; metal_type: string },
  ): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.typeServiceClient.send({ module: 'type', action: 'create' }, data),
      );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: { name?: string; purity?: string; metal_type?: string },
  ): Promise<any> {
    try {
      const payload = { id, ...data };
      const result = await firstValueFrom(
        this.typeServiceClient.send(
          { module: 'type', action: 'update' },
          payload,
        ),
      );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      const result = await firstValueFrom(
        this.typeServiceClient.send(
          { module: 'type', action: 'delete' },
          { id },
        ),
      );

      if (!result.success) {
        throw new HttpException(result.message, result.statusCode);
      }

      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
