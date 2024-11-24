import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh.dto';
import { AuthService } from './auth.service';
import { ErrorHandler } from '../../shared/error/error.handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly errorHandler: ErrorHandler,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignupDto): Promise<void> {
    try {
      await this.authService.signup(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    try {
      console.log(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    try {
      console.log(body);
    } catch (error) {
      await this.errorHandler.handleError(error);
    }
  }
}
