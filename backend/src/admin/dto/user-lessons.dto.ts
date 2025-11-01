import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class UserLessonsDto {
  @ApiProperty({ 
    type: [Number], 
    example: [1, 2, 3], 
    description: 'ID предметов' 
  })
  @IsArray({ message: 'lessonsIds должен быть массивом' })
  @IsNumber({}, { each: true, message: 'Каждый элемент lessonsIds должен быть числом' })
  lessonsIds: number[];
}