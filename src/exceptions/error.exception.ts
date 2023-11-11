import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    const errors = exception.getResponse() as any;

    if (errors.errors) {
      return response.status(status).json({
        status_code: status,
        message: errors.message,
        errors: errors.errors,
        // path: request.url,
      });
    }

    return response.status(status).json({
      status_code: status,
      message,
      // path: request.url,
      //   timestamp: new Date().toISOString(),
    });
  }
}
