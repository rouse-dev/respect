import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateTeacherDto {
  @ApiProperty({ example: 'teacher@example.com', description: 'Новый email учителя' })
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'password123', description: 'Новый пароль учителя' })
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({ example: 'Сальманов Алмас', description: 'Новое имя учителя' })
  @IsString()
  name?: string;
}