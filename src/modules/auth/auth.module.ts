import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { ErrorModule } from '../../shared/error/error.module';

@Module({
  imports: [UserModule, ConfigModule, ErrorModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}