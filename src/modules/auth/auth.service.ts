import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  CRYPT_SALT,
  JWT_SECRET_REFRESH_KEY,
  TOKEN_EXPIRE_TIME,
  TOKEN_REFRESH_EXPIRE_TIME,
} from './constants/auth.constants';
import { SignupDto } from './dtos/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface';
import { UserResponseDto } from '../user/dtos/user-response.dto';
import { LoginDto } from './dtos/login.dto';
import { LoginResponseDto } from './dtos/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ login, password }: SignupDto): Promise<LoginResponseDto> {
    const hashedPassword = await this.hashPassword({ password });
    await this.userService.createUser({
      login,
      password: hashedPassword,
    });
    return this.login({ login, password });
  }

  async login({ login, password }: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(login);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const compare = await this.comparePasswordHash({
      password,
      hashedPassword: user.password,
    });
    if (!compare) {
      throw new ForbiddenException('Invalid password');
    }
    const payload: JwtPayload = { userId: user.id, login: user.login };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>(TOKEN_EXPIRE_TIME),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>(JWT_SECRET_REFRESH_KEY),
      expiresIn: this.configService.get<string>(TOKEN_REFRESH_EXPIRE_TIME),
    });
    return { id: user.id, accessToken, refreshToken };
  }

  async findUser({ userId }: JwtPayload): Promise<UserResponseDto> {
    return await this.userService.getUserById(userId);
  }

  private async hashPassword({
    password,
  }: {
    password: string;
  }): Promise<string> {
    const salt = parseInt(this.configService.get<string>(CRYPT_SALT), 10);
    return await bcrypt.hash(password, salt);
  }

  private async comparePasswordHash({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  }
}
