import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  HttpException,
  Inject,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/wishlist')
export class WishlistController {
  constructor(
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async wishlistProduct(@Body() data: any, @Req() req: any): Promise<any> {
    const user_id = req.user.user_id;
    const payload = { ...data, user_id };
    console.log(data);

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'wishlist', action: 'wishlistProduct' },
        payload,
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
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-wishlist')
  async isWishlist(
    @Query('product_id') product_id: string,
    @Req() req: any,
  ): Promise<any> {
    const user_id = req.user.user_id;

    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'wishlist', action: 'isWishlist' },
        { user_id, product_id },
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
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishlist(@Req() req: any): Promise<any> {
    const user_id = req.user.user_id;

    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'wishlist', action: 'getWishlistByUserId' },
        { user_id },
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
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':product_id')
  async unwishlistProduct(
    @Param('product_id') product_id: string,
    @Req() req: any,
  ): Promise<any> {
    const user_id = req.user.user_id;

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'wishlist', action: 'unwishlistProduct' },
        { user_id, product_id },
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
  }
}
