import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ example: 'Иван Иванов', description: 'Имя студента' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  @IsNumber()
  groupsId: number;

  @ApiProperty({ example: 'uploads/avatars/default.jpg', description: 'Аватар студента', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 0, description: 'Начальная репутация', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reputation?: number;
}

export class CreateManyStudentsDto {
  @ApiProperty({ type: [CreateStudentDto], description: 'Массив студентов' })
  students: CreateStudentDto[];
}

export class StudentResponseDto {
  @ApiProperty({ example: 1, description: 'ID студента' })
  id: number;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя студента' })
  name: string;

  @ApiProperty({ example: 'ivan.ivanov.is223@edu.ru', description: 'Email студента' })
  email: string;

  @ApiProperty({ example: 'uploads/avatars/default.jpg', description: 'Аватар студента' })
  avatar: string;

  @ApiProperty({ example: 100, description: 'Репутация студента' })
  reputation: number;

  @ApiProperty({ example: 1, description: 'ID группы студента' })
  groupsId: number;

  @ApiProperty({ example: { id: 1, name: 'ИС-223' }, description: 'Группа студента' })
  groups: {
    id: number;
    name: string;
  };

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Дата создания' })
  createdAt: Date;
}