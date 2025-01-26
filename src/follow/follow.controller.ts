import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/follow')
export class FollowController {
  private followServiceClient: ClientProxy;

  constructor() {
    this.followServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 3010 }, // Sesuaikan host dan port microservice Anda
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async followStore(@Body() data: any, @Req() req: any): Promise<any> {
    const customer_id = req.user.user_id;
    const payload = { ...data, customer_id };

    const result = await firstValueFrom(
      this.followServiceClient.send(
        { module: 'follow', action: 'followStore' },
        payload,
      ),
    );
    //
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
  async getFollowedStores(@Req() req: any): Promise<any> {
    const customer_id = req.user.user_id;

    const result = await firstValueFrom(
      this.followServiceClient.send(
        { module: 'follow', action: 'getFollowedStores' },
        { customer_id },
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
  @Delete(':store_id')
  async unfollowStore(
    @Param('store_id') store_id: string,
    @Req() req: any,
  ): Promise<any> {
    const customer_id = req.user.user_id;

    const result = await firstValueFrom(
      this.followServiceClient.send(
        { module: 'follow', action: 'unfollowStore' },
        { store_id, customer_id },
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
  @Get('is-following')
  async isFollowing(
    @Query('store_id') store_id: string,
    @Req() req: any,
  ): Promise<any> {
    const customer_id = req.user.user_id;

    const result = await firstValueFrom(
      this.followServiceClient.send(
        { module: 'follow', action: 'isFollowing' },
        { store_id, customer_id },
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
