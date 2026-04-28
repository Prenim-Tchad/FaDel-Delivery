import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../../../shared/types/auth.types';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return (request as any).user as UserPayload;
  },
);
