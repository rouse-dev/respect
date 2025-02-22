import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNotEmpty, isNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'Группа студента' })
  @IsNotEmpty()
  groupsId: number;
}

export class CreateManyStudentsDto {
  @ApiProperty({ type: [CreateStudentDto], description: 'Массив студентов' })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[];
}

export class StudentResponseDto {
  @ApiProperty({ example: 1, description: 'ID студента' })
  @IsNotEmpty()
  id: number;

  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  @IsNotEmpty()
  groupsId: number;

  @ApiProperty({ example: "ИС-223", description: 'Название группы' })
  @IsNotEmpty()
  groups: {id: number, name: string};
}