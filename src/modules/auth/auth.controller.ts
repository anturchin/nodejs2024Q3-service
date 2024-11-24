import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh.dto';
import { AuthService } from './auth.service';
import { ErrorHandler } from '../../shared/error/error.handler';
import { LoginResponseDto } from './dtos/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignupDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.signup(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto): Promise<LoginResponseDto> {
    try {
      return await this.authService.login(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto): Promise<LoginResponseDto> {
    try {
      if (!body.refreshToken) {
        throw new UnauthorizedException('No refresh token');
      }
      return await this.authService.refresh(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }
}
