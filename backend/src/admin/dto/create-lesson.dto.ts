import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ example: 'Математика', description: 'Название учебного предмета' })
  @IsNotEmpty()
  name: string;
}