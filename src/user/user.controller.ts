import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { User } from './entities/user.entity';
import { ErrorHandler } from '../common/utils/error-handler.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<User> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    try {
      return await this.userService.updateUserPassword(id, updatePasswordDto);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    try {
      await this.userService.deleteUser(id);
    } catch (error) {
      ErrorHandler.handleError(error);
    }
  }
}
