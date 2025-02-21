import { ApiProperty } from '@nestjs/swagger';

export class UpdateGroupDto {
  @ApiProperty({ example: 'ИС-223б', description: 'Новое название группы' })
  name?: string;
}
