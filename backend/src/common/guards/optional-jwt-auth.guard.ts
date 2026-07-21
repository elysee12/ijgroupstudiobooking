import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Like JwtAuthGuard but does NOT throw if no token is present.
 * req.user will be undefined for unauthenticated requests.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // Override to swallow auth errors — unauthenticated is allowed
  handleRequest(_err: any, user: any) {
    return user ?? null;
  }
}
