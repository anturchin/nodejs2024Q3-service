import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { DatabaseModule } from '../../database/database.module';
import { ErrorModule } from '../../error/error.module';

@Module({
  imports: [DatabaseModule, ErrorModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
})
export class UserModule {}
