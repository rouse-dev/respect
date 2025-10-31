import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateDebtRequestDto {
  @ApiProperty({ description: 'ID предмета (урока)' })
  @IsNumber()
  lessonId: number;

  @ApiProperty({ description: 'Количество баллов для списания' })
  @IsNumber()
  @Min(1)
  @Max(1000)
  points: number;

  @ApiProperty({ description: 'Описание причины списания', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}