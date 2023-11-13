import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerHttpMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = req;
    const userAgent = req.get('user-agent') || '';

    const start = process.hrtime();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');

      const diff = process.hrtime(start);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;

      this.logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${time.toFixed(
          3,
        )}ms`,
      );
    });

    next();
  }
}
