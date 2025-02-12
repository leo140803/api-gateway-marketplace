import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), // Daftarkan strategi 'jwt'
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_SECRET') || 'marketplace-logamas',
        signOptions: { expiresIn: '30d' },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  providers: [JwtStrategy],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
