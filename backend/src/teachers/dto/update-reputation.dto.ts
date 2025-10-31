import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateReputationDto {
  @ApiProperty({ example: 10, description: 'Количество очков репутации' })
  @IsNumber()
  @Min(1)
  points: number;

  @ApiProperty({ 
    example: 'За активную работу на уроке', 
    description: 'Причина изменения репутации',
    required: false 
  })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiProperty({ 
    example: 1, 
    description: 'ID предмета (опционально)',
    required: false 
  })
  @IsNumber()
  @IsOptional()
  lessonId?: number;

  @ApiProperty({ 
    example: 2, 
    description: 'Номер пары (опционально)',
    required: false 
  })
  @IsNumber()
  @IsOptional()
  class?: number;
}