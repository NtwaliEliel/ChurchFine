import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export type AuthUser = {
  sub: string;
  churchId: string;
  role: 'member' | 'admin' | 'super_admin';
  phone: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (req as any).user as AuthUser;
  },
);

