import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonDto {
  @ApiProperty({ example: 'Математика', description: 'Название учебного предмета' })
  name: string;
}