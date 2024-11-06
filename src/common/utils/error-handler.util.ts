import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCommonMessage } from '../constants/error-messages.constants';

export class ErrorHandler {
  static handleError(error: unknown): void {
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
