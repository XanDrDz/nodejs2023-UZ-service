import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/decorator.public';

@Injectable()
export class JwtAuthGuard extends AuthGuard('accessStrategy') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler,
      context.getClass,
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
