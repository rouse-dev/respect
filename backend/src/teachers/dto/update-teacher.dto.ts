import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({ example: 'teacher@example.com', description: 'Новый email учителя' })
  email?: string;

  @ApiProperty({ example: 'password321', description: 'Текущий пароль учителя' })
  oldPassword?: string;

  @ApiProperty({ example: 'password123', description: 'Новый пароль учителя' })
  password?: string;

  @ApiProperty({ example: 'Сальманов Алмас', description: 'Новое имя учителя' })
  name?: string;
}