import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';

@Controller('/api/store')
export class StoreController {
  constructor(
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  @Get()
  async findAll(): Promise<any> {
    console.log('Fetching all stores');
    return this.marketplaceReaderClient
      .send({ service: 'marketplace', module: 'store', action: 'findAll' }, {})
      .toPromise();
  }

  @Get('search')
  async searchStores(@Query('q') query: string): Promise<any> {
    console.log(`Searching stores with keyword: ${query}`);

    if (!query || query.trim() === '') {
      throw new HttpException('Query parameter is required', 400);
    }

    try {
      const response = await this.marketplaceReaderClient
        .send(
          { service: 'marketplace', module: 'store', action: 'search' },
          { query },
        )
        .toPromise();

      return response;
    } catch (error) {
      console.error('Error searching stores:', error.message);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<any> {
    console.log(`Fetching store with ID: ${id}`);
    return this.marketplaceReaderClient
      .send(
        { service: 'marketplace', module: 'store', action: 'findOne' },
        { id },
      )
      .toPromise();
  }
}
