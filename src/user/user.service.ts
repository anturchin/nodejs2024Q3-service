import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { UserResponseDto } from './dtos/user-response.dto';

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
        createdAt,
        updatedAt,
      }),
    );
    return usersWithoutPassword;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    const {
      id: userId,
      login,
      version,
      updatedAt,
      createdAt,
    } = await this.userRepository.getUserById(id);
    return { id: userId, login, version, updatedAt, createdAt };
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { id, login, version, createdAt, updatedAt } =
      await this.userRepository.createUser(createUserDto);
    return { id, login, version, createdAt, updatedAt };
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
    return { id: userId, login, version, createdAt, updatedAt };
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.deleteUser(id);
  }
}
