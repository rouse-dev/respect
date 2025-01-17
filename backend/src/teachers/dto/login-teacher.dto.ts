import { IsEmail, IsString } from 'class-validator';

export class LoginTeacherDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}