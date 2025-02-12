import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  HttpException,
  Inject,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/user-poin')
export class UserPointController {
  constructor(
    @Inject('MARKETPLACE') private readonly userPoinServiceClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':storeId')
  async getUserStorePoints(
    @Param('storeId') storeId: string,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.userPoinServiceClient.send(
        { module: 'user-poin', action: 'getUserStorePoints' },
        { userId, storeId },
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

  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addPoints(
    @Body('storeId') storeId: string,
    @Body('points') points: number,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.userPoinServiceClient.send(
        { module: 'user-poin', action: 'addPoints' },
        { userId, storeId, points },
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

  @UseGuards(JwtAuthGuard)
  @Put('deduct')
  async deductPoints(
    @Body('storeId') storeId: string,
    @Body('points') points: number,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.userPoinServiceClient.send(
        { module: 'user-poin', action: 'deductPoints' },
        { userId, storeId, points },
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

  @UseGuards(JwtAuthGuard)
  @Put('update')
  async updatePoints(
    @Body('storeId') storeId: string,
    @Body('points') points: number,
    @Req() req: any,
  ): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.userPoinServiceClient.send(
        { module: 'user-poin', action: 'updatePoints' },
        { userId, storeId, points },
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
