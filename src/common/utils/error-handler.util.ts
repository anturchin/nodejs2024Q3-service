import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorHandler {
  static handleError(error: unknown): void {
    if (error instanceof BadRequestException) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    } else if (error instanceof NotFoundException) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    } else if (error instanceof ForbiddenException) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    } else {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
