import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { ErrorModule } from '../../shared/error/error.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY, TOKEN_EXPIRE_TIME } from './constants/auth.constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UserModule,
    ErrorModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET_KEY),
        signOptions: {
          expiresIn: configService.get<string>(TOKEN_EXPIRE_TIME),
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
