import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../database/repositories/user.repository';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users: User[] = await this.userRepository.getAllUsers();
    const usersWithoutPassword: UserResponseDto[] = users.map(
      ({ id, login, version, createdAt, updatedAt }: User) => ({
        id,
        login,
        version,
        createdAt: createdAt.getTime(),
        updatedAt: updatedAt.getTime(),
      }),
    );
    return usersWithoutPassword;
  }

  async getUserByEmail(login: string): Promise<User> {
    return await this.userRepository.getUserByEmail(login);
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const {
      id: userId,
      login,
      version,
      updatedAt,
      createdAt,
    } = await this.userRepository.getUserById(id);
    return {
      id: userId,
      login,
      version,
      updatedAt: updatedAt.getTime(),
      createdAt: createdAt.getTime(),
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { id, login, version, createdAt, updatedAt } =
      await this.userRepository.createUser(createUserDto);
    return {
      id,
      login,
      version,
      updatedAt: updatedAt.getTime(),
      createdAt: createdAt.getTime(),
    };
  }

  async updateUserPassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const {
      id: userId,
      login,
      version,
      createdAt,
      updatedAt,
    } = await this.userRepository.updateUserPassword(id, updatePasswordDto);
    return {
      id: userId,
      login,
      version,
      updatedAt: updatedAt.getTime(),
      createdAt: createdAt.getTime(),
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
