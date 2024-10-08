import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.headers.authorization;
    try {
      if (!token) throw new UnauthorizedException('You are not authorized');

      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      req['id'] = payload.id;
    } catch (err) {
      throw new Error(err.message);
    }
    return true;
  }
}
