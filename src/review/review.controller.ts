import {
  Body,
  Controller,
  HttpException,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/api/review')
export class ReviewController {
  constructor(
    @Inject('MARKETPLACE') private readonly reviewServiceClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async giveReview(@Body() data: any, @Req() req: any): Promise<any> {
    const user_id = req.user.user_id;
    const payload = { ...data, user_id };
    console.log(payload);
    const result = await firstValueFrom(
      this.reviewServiceClient.send(
        { module: 'review', action: 'giveReview' },
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
}
