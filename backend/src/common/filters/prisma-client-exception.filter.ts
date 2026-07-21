import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../../../generated/prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientInitializationError, Prisma.PrismaClientUnknownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // P1017: Server has closed the connection
    if (exception.code === 'P1017') {
      console.error('Prisma P1017: Connection closed by server. Usually due to max_allowed_packet or timeout.');
      return response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'The image data is too large for the database server to process. We have compressed it, but your database configuration (max_allowed_packet) might still be too low.',
        error: 'Service Unavailable',
      });
    }

    // P2025: Record not found
    if (exception.code === 'P2025') {
      const status = HttpStatus.NOT_FOUND;
      return response.status(status).json({
        statusCode: status,
        message: exception.message.replace(/\n/g, ''),
        error: 'Not Found',
      });
    }

    // Default handling for other Prisma errors
    super.catch(exception, host);
  }
}
