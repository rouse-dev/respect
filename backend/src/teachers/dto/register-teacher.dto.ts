import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterTeacherDto {
  @ApiProperty({ example: 'teacher@example.com', description: 'Email учителя' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль учителя' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Сальманов Алмас', description: 'Имя учителя', required: false })
  @IsString()
  name?: string;
}