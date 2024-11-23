import { validate as isUuid } from 'uuid';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { ErrorUserMessages } from '../../common/constants/error-messages.constants';
import { User } from '@prisma/client';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class UserRepository {
  constructor(private readonly db: DatabaseService) {}

  async getAllUsers(): Promise<User[]> {
    return this.db.user.findMany();
  }

  async getUserById(id: string): Promise<User> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { login, password } = createUserDto;
    const user = await this.db.user.create({
      data: {
        login,
        password,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return user;
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }

    const user = await this.db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException(ErrorUserMessages.OLD_PASSWORD_INCORRECT);
    }

    const updatedUser = await this.db.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: user.version + 1,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!isUuid(id)) {
      throw new BadRequestException(ErrorUserMessages.INVALID_USER_ID_FORMAT);
    }
    const user = await this.db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(ErrorUserMessages.USER_NOT_FOUND);
    }
    await this.db.user.delete({
      where: { id },
    });
  }
}
