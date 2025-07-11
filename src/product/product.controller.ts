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
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/products')
export class ProductController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  @Get()
  async getAllProducts(): Promise<any> {
    console.log('ada req');
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
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

  @Get('recommendation')
  @UseGuards(JwtAuthGuard)
  async getRecommendation(@Req() req: any): Promise<any> {
    try {
      const userId = req.user.user_id;
      const result = await firstValueFrom(
        this.marketplaceReaderClient.send(
          { module: 'product', action: 'getRecommendation' },
          { user_id: userId },
        ),
      );
      if (!result.success) {
        throw new HttpException(
          {
            success: result.success || false,
            message: result.message || 'Internal Server Error',
            errors: result.errors || [],
          },
          result.statusCode || 500,
        );
      }

      return result;
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message || 'Internal Server Error',
          errors: error.errors || [],
        },
        error.statusCode || 500,
      );
    }
  }

  @Get('barcode/:barcode')
  async getProductCodeByBarcode(
    @Param('barcode') barcode: string,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'product', action: 'getProductCodeByBarcode' },
        { barcode },
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
      this.marketplaceReaderClient.send(
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

  @Get('search-by-store')
  async searchProductsByStore(
    @Query('q') query: string,
    @Query('storeId') storeId: string,
  ): Promise<any> {
    if (!query || !storeId) {
      throw new HttpException('Query and storeId are required', 400);
    }

    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'product', action: 'searchProductsByStore' },
        { query, storeId },
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceReaderClient.send(
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
      this.marketplaceWriterClient.send(
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
      this.marketplaceWriterClient.send(
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
      this.marketplaceWriterClient.send(
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
