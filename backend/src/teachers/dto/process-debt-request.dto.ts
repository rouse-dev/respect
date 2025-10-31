import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ProcessDebtRequestDto {
  @ApiProperty({ 
    example: 'Заявка одобрена, долг списан', 
    description: 'Комментарий учителя',
    required: false 
  })
  @IsString()
  @IsOptional()
  comment?: string;
}