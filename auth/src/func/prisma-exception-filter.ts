import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode: number;
    let message: string;
    let error: string;

    switch (exception.code) {
      case 'P2002':
        statusCode = HttpStatus.CONFLICT;
        message = 'Resource already exists';
        error = 'Conflict';
        break;
      case 'P2025':
        statusCode = HttpStatus.NOT_FOUND;
        message = 'Resource not found';
        error = 'Not Found';
        break;
      default:
        statusCode = HttpStatus.SERVICE_UNAVAILABLE;
        message = 'An unexpected error occurred. Please try again later.';
        error = 'Service Unavailable';
        break;
    }

    return response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
