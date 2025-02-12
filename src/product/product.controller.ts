import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  Query,
  Inject,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/products')
export class ProductController {
  constructor(
    @Inject('MARKETPLACE') private readonly productServiceClient: ClientProxy,
  ) {}

  @Get()
  async getAllProducts(): Promise<any> {
    console.log('ada req');
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'getAllProducts' },
        {},
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

  @Get('search')
  async searchProducts(@Query('q') query: string): Promise<any> {
    if (!query || query.trim() === '') {
      throw new HttpException('Query parameter is required', 400);
    }

    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'searchProducts' },
        { query },
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

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'getProductById' },
        { id },
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

  @Get('store/:storeId')
  async getProductsByStore(@Param('storeId') storeId: string): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'getProductsByStore' },
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

  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'getProductsByCategory' },
        { categoryId },
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

  @Post()
  async createProduct(@Body() body: any): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'createProduct' },
        body,
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

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'updateProduct' },
        { id, ...body },
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

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<any> {
    const result = await firstValueFrom(
      this.productServiceClient.send(
        { module: 'product', action: 'deleteProduct' },
        { id },
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
