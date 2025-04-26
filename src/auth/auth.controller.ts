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
  Inject,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('/api/user')
export class AuthController {
  constructor(
    @Inject('MARKETPLACE_WRITER')
    private readonly marketplaceWriterClient: ClientProxy,
    @Inject('MARKETPLACE_READER')
    private readonly marketplaceReaderClient: ClientProxy,
  ) {}

  // Endpoint to send OTP to user's email
  @Post('/send-otp')
  async sendOtp(@Body() body: { email: string }): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'sendOtp' },
        { email: body.email },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to send OTP',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'OTP sent successfully',
      success: true,
      statusCode: 200,
    };
  }

  // Endpoint to validate OTP
  @Post('/validate-otp')
  async validateOtp(
    @Body() body: { email: string; otp: string },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'validateOtp' },
        { email: body.email, otp: body.otp },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Invalid OTP',
        result.statusCode || HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'OTP validated successfully',
      success: true,
      statusCode: 200,
    };
  }

  // Endpoint to change password using OTP
  @Post('/change-password-with-otp-and-old-password')
  async changePasswordWithOtpAndOldPassword(
    @Body()
    body: {
      email: string;
      oldPassword: string;
      otp: string;
      newPassword: string;
    },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'changePasswordWithOtpAndOldPassword' },
        {
          email: body.email,
          oldPassword: body.oldPassword,
          otp: body.otp,
          newPassword: body.newPassword,
        },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Failed to change password',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Password changed successfully',
      success: true,
      statusCode: 200,
    };
  }

  @Get()
  async getAllUsers(): Promise<any> {
    console.log('masuk sini!');
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
        { module: 'user', action: 'getAll' },
        {},
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

  //DONE
  @Put('/soft-delete/:id')
  async softDeleteUser(@Param('id') id: string): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
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

  //done
  @Put('/edit/:id')
  async editUserByAdmin(
    @Param('id') id: string,
    @Body() body: { name?: string; phone?: string; is_verified?: boolean },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
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

  //done
  @Post('/add-by-admin')
  async addUserByAdmin(@Body() body: any): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
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
      this.marketplaceWriterClient.send(
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

  //DONE
  @Post('/register')
  async register(@Body() data: any): Promise<any> {
    console.log(data);
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'register' },
        data,
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

  //DONE
  @Get('/verify')
  async verifyEmail(
    @Query('token') token: string,
    @Headers('user-agent') userAgent: string,
    @Res() res,
  ) {
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
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
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'login' },
        body,
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

  //DONE
  @UseGuards(JwtAuthGuard)
  @Post('/device-token')
  async addDeviceToken(
    @Req() req: any,
    @Body() body: { deviceToken: string },
  ): Promise<any> {
    const userId = req.user.user_id; // Dari JwtAuthGuard
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
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
    console.log(userId);
    const result = await firstValueFrom(
      this.marketplaceReaderClient.send(
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

  //DONE
  @UseGuards(JwtAuthGuard)
  @Put('/update-details')
  async updateDetails(
    @Req() req: any,
    @Body() body: { name?: string; phone?: string },
  ): Promise<any> {
    console.log(body);
    const userId = req.user.user_id; // Ambil userId dari JWT Guard

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
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

  @Post('/forgot-password')
  async requestPasswordReset(@Body() body: { email: string }): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'requestPasswordReset' },
        { email: body.email },
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'If the email is registered, a reset link will be sent.',
      success: true,
      statusCode: 200,
    };
  }

  @Get('/reset-password-redirect')
  async redirectResetPassword(
    @Query('token') token: string,
    @Query('email') email: string,
    @Headers('user-agent') userAgent: string,
    @Res() res,
  ) {
    try {
      if (!token || !email) {
        throw new HttpException(
          'Invalid or missing parameters',
          HttpStatus.BAD_REQUEST,
        );
      }

      const schemeUrl = `marketplace-logamas://reset-password?email=${email}&token=${token}`;
      const webUrl = `https://yourwebsite.com/reset-password?email=${email}&token=${token}`;

      if (
        userAgent.toLowerCase().includes('iphone') ||
        userAgent.toLowerCase().includes('ipad') ||
        userAgent.toLowerCase().includes('ios')
      ) {
        return res.redirect(schemeUrl);
      } else if (userAgent.toLowerCase().includes('android')) {
        return res.redirect(schemeUrl);
      } else {
        return res.redirect(webUrl);
      }
    } catch (error) {
      console.error('Error redirecting to app:', error.message);
      throw new HttpException(
        'Failed to process your request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('/reset-password')
  async resetPassword(
    @Body() body: { token: string; newPassword: string },
  ): Promise<any> {
    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'resetPassword' },
        body,
      ),
    );

    if (!result.success) {
      throw new HttpException(
        result.message || 'Internal Server Error',
        result.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: 'Password reset successfully',
      success: true,
      statusCode: 200,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/change-password')
  async changePassword(
    @Req() req: any,
    @Body() body: { oldPassword: string; newPassword: string },
  ): Promise<any> {
    const userId = req.user.user_id; // Ambil userId dari JWT Guard

    const result = await firstValueFrom(
      this.marketplaceWriterClient.send(
        { module: 'user', action: 'changePassword' },
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
