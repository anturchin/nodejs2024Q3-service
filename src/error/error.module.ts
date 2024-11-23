import { Module } from '@nestjs/common';
import { ErrorHandler } from './error.handler';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [ErrorHandler],
  exports: [ErrorHandler],
})
export class ErrorModule {}
