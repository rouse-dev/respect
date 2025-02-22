import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateGroupDto {
  @ApiProperty({ example: 'ИС-223б', description: 'Новое название группы' })
  @IsNotEmpty()
  name?: string;
}
