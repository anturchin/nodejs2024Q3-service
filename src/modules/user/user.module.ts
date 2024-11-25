import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from '../../database/repositories/user.repository';
import { UserService } from './user.service';
import { DatabaseModule } from '../../database/database.module';
import { ErrorModule } from '../../common/error/error.module';

@Module({
  imports: [DatabaseModule, ErrorModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
