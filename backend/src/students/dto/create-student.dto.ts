import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested, IsNotEmpty, IsEmail, IsOptional, MinLength, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateStudentDto {
  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'gumerov@example.com', description: 'Email студента' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль студента' })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  @IsNumber()
  @IsNotEmpty()
  groupsId: number;

  @ApiProperty({ example: 'uploads/avatars/default.jpg', description: 'Аватар студента', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 0, description: 'Репутация студента', required: false })
  @IsNumber()
  @IsOptional()
  reputation?: number;
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

  @ApiProperty({ example: 'gumerov@example.com', description: 'Email студента' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'uploads/avatars/default.jpg', description: 'Аватар студента' })
  @IsNotEmpty()
  avatar: string;

  @ApiProperty({ example: 100, description: 'Репутация студента' })
  @IsNotEmpty()
  reputation: number;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  @IsNotEmpty()
  groupsId: number;

  @ApiProperty({ example: { id: 1, name: 'ИС-223' }, description: 'Группа студента' })
  @IsNotEmpty()
  groups: {
    id: number;
    name: string;
  };

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Дата создания' })
  @IsNotEmpty()
  createdAt: Date;
}