import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateLessonDto {
  @ApiProperty({ example: 'Высшая математика', description: 'Название учебного предмета' })
  @IsNotEmpty()
  name: string;
}