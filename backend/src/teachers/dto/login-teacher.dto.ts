import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginTeacherDto {
  @ApiProperty({ example: "teacher@example.com", description: "Email учителя" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "password123", description: "Пароль учителя" })
  @IsString()
  @IsNotEmpty()
  password: string;
}