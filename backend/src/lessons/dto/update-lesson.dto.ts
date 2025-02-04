import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiProperty({ example: 'Высшая математика', description: 'Название учебного предмета' })
  name?: string;
}