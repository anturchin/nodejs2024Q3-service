import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { LoggingService } from '../logging/logging.service';
import { ErrorCommonMessage } from '../common/constants/error-messages.constants';

@Injectable()
export class ErrorHandler {
  constructor(private readonly loggingService: LoggingService) {}

  async handleError(error: unknown): Promise<void> {
    if (error instanceof HttpException) {
      await this.loggingService.error(error.message, error.stack);
    }

    if (error instanceof BadRequestException) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } else if (error instanceof NotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } else if (error instanceof ForbiddenException) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    } else if (error instanceof UnprocessableEntityException) {
      throw new HttpException(error.message, HttpStatus.UNPROCESSABLE_ENTITY);
    } else {
      throw new HttpException(
        ErrorCommonMessage.INTERNET_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
