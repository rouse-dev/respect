import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginTeacherDto {
  @ApiProperty({ example: "teacher@example.com", description: "Email учителя" })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "password123", description: "Пароль учителя" })
  @IsString()
  password: string;
}