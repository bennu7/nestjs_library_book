import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export function successResponse(
  res: Response,
  message: string,
  status_code: number = HttpStatus.OK,
  data?: any,
) {
  return res.status(status_code).json({
    status_code,
    message: message.toUpperCase(),
    data,
  });
}
