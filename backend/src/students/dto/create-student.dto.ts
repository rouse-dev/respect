import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Группа студента' })
  groupsId: number;
}

export class CreateManyStudentsDto {
  @ApiProperty({ type: [CreateStudentDto], description: 'Массив студентов' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[];
}

export class StudentResponseDto {
  @ApiProperty({ example: 1, description: 'ID студента' })
  id: number;

  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента' })
  name: string;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  groupsId: number;

  @ApiProperty({ example: "ИС-223", description: 'Название группы' })
  groups: {id: number, name: string};
}