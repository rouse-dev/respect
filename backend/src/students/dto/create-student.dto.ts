import { IsString, IsEmail, IsInt } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  groupsId: number;
}