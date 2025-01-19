import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsInt } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: "Гумеров Динар", description: "Имя студента" })
  @IsString()
  name: string;

  @ApiProperty({ example: "ИС-223", description: "Группа студента" })
  groupsId: number;
}