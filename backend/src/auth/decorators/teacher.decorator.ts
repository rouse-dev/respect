import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TeacherGuard } from '../guards/teacher.guard';

export function TeacherOnly() {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), TeacherGuard),
  );
}