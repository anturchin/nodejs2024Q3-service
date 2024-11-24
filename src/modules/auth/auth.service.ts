import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { CRYPT_SALT } from './constants/auth.constants';
import { SignupDto } from './dtos/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async signup({ login, password }: SignupDto): Promise<void> {
    const hashedPassword = await this.hashPassword({ password });
    await this.userService.createUser({
      login,
      password: hashedPassword,
    });
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
