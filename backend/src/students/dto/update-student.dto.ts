import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ValidateNested } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Гумеров Динар', description: 'Новое имя студента' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Новая группа студента' })
  groupsId: number;
}