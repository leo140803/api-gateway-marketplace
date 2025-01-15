import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Headers,
  Req,
  Res,
  UseGuards,
  HttpException,
  Param,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/user')
export class AuthController {
  private userServiceClient: ClientProxy;

  constructor() {
    this.userServiceClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3010,
      },
    });
  }

  @Get()
  async getAllUsers(): Promise<any> {
    console.log('masuk sini!');
    const result = await firstValueFrom(
      this.userServiceClient.send({ module: 'user', action: 'getAll' }, {}),
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

  @Put('/soft-delete/:id')
  async softDeleteUser(@Param('id') id: string): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'softDelete' },
        { id },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Put('/edit/:id')
  async editUserByAdmin(
    @Param('id') id: string,
    @Body() body: { name?: string; phone?: string; is_verified?: boolean },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'updateByAdmin' },
        { userId: id, ...body },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Post('/add-by-admin')
  async addUserByAdmin(@Body() body: any): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'addByAdmin' },
        body,
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/edit/:id')
  async editUser(
    @Param('id') id: string,
    @Body() body: { name?: string; phone?: string },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'edit' },
        { id, ...body },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Post('/register')
  async register(@Body() data: any): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send({ module: 'user', action: 'register' }, data),
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

  @Get('/verify')
  async verifyEmail(
    @Query('token') token: string,
    @Headers('user-agent') userAgent: string,
    @Res() res,
  ) {
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'verify' },
        { token },
      ),
    );

    if (result.success) {
      console.log(`User-Agent: ${userAgent}`); // Debugging

      if (
        userAgent.toLowerCase().includes('iphone') || // Periksa iOS
        userAgent.toLowerCase().includes('ipad') ||
        userAgent.toLowerCase().includes('ios')
      ) {
        return res.redirect('marketplace-logamas://email_verified');
      } else if (userAgent.toLowerCase().includes('android')) {
        return res.redirect('marketplace-logamas://email_verified');
      } else {
        return res.redirect('https://yourwebsite.com/verification-success');
      }
    } else {
      throw new HttpException(
        {
          success: result.success || false,
          message: result.message || 'Internal Server Error',
          errors: result.errors || [],
        },
        result.statusCode || 500,
      );
    }
  }

  @Post('/login')
  async login(@Body() body: any): Promise<any> {
    const result = await firstValueFrom(
      this.userServiceClient.send({ module: 'user', action: 'login' }, body),
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
  @Get('/protected')
  getProtectedData(@Req() req: any): any {
    return {
      message: 'Hello, World!',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/device-token')
  async addDeviceToken(
    @Req() req: any,
    @Body() body: { deviceToken: string },
  ): Promise<any> {
    const userId = req.user.user_id; // Dari JwtAuthGuard
    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'addDeviceToken' },
        { userId, deviceToken: body.deviceToken },
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
  @Get('profile')
  async findById(@Req() req: any): Promise<any> {
    const userId = req.user.user_id;

    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'findById' },
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

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<any> {
    const userId = req.user.user_id; // Ambil userId dari JWT Guard

    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'updatePassword' },
        { userId, ...body },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-details')
  async updateDetails(
    @Req() req: any,
    @Body() body: { name?: string; phone?: string },
  ): Promise<any> {
    const userId = req.user.user_id; // Ambil userId dari JWT Guard

    const result = await firstValueFrom(
      this.userServiceClient.send(
        { module: 'user', action: 'updateDetails' },
        { userId, ...body },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }
}
