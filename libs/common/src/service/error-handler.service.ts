import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Service for handling HTTP exceptions.
 */
export class ErrorHandlerService {
  /**
   * Handles the HTTP exception.
   * @param error - The error object.
   * @throws {HttpException} - Throws an HttpException with the error message and status code.
   */
  async HttpException(error: any) {
    throw new HttpException(
      error.message,
      error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
