import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    user_id: string;
    role: string;
  };
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as RequestWithUser;
    let decoded: any;

    try {
      const token = request?.headers?.authorization?.split(' ')[1];

      decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SIGN_SECRET,
      });
    } catch (err) {
      throw new HttpException(
        'invalid token!'.toUpperCase(),
        HttpStatus.UNAUTHORIZED,
      );
    }

    request.user = decoded;

    if (!roles.includes(request.user.role)) {
      throw new HttpException(
        'Anda tidak memiliki akses'.toUpperCase(),
        HttpStatus.FORBIDDEN,
      );
    }

    return true;
  }
}
