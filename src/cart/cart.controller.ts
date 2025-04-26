import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/cart')
export class CartController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  @Get(':userId')
  async getCartItems(@Param('userId') userId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'cart', action: 'getCartItems' },
        { userId },
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
  async addToCart(
    @Body('user_id') userId: string,
    @Body('product_code_id') product_code_id: string,
    @Body('quantity') quantity: number,
  ): Promise<any> {
    console.log('add to cart');
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'addToCart' },
        { userId, product_code_id, quantity },
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

  @Put(':cartId')
  async updateCartItem(
    @Param('cartId') cartId: string,
    @Body('quantity') quantity: number,
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'updateCartItem' },
        { cartId, quantity },
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

  @Patch(':cartId/increment')
  async incrementCartItem(@Param('cartId') cartId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'incrementCartItem' },
        { cartId },
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

  @Patch(':cartId/decrement')
  async decrementCartItem(@Param('cartId') cartId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'decrementCartItem' },
        { cartId },
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

  @Delete(':cartId')
  async removeCartItem(@Param('cartId') cartId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'removeCartItem' },
        { cartId },
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

  @Delete('/clear/:userId')
  async clearCart(@Param('userId') userId: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'cart', action: 'clearCart' },
        { userId },
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
