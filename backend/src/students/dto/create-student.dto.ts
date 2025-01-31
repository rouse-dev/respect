import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: "Гумеров Динар", description: "Имя студента" })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: "Группа студента" })
  groupsId: number;
}

export class CreateManyStudentsDto {
  @ApiProperty({ type: [CreateStudentDto], description: "Массив студентов" })
  @IsArray()
  students: CreateStudentDto[];
}