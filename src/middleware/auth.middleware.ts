import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();

interface RequestWithUser extends Request {
  user: {
    user_id: string;
    role: string;
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SIGN_SECRET,
      });
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Auth failed must login first'.toUpperCase(),
      });
    }
  }
}
