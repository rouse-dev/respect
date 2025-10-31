import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';

export function AdminOnly() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), AdminGuard),
  );
}