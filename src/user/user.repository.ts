import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ErrorUserMessages } from '../common/constants/error-messages.constants';

@Injectable()
export class UserRepository {
  private readonly users: User[] = [];

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }

    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(ErrorUserMessages.OLD_PASSWORD_INCORRECT);
    }

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  async deleteUser(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }

    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }

    this.users.splice(index, 1);
  }
}
