import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class RegisterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email пользователя' })
  @IsEmail({}, { message: 'Некорректный email' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  password: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя', required: false })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;

  @ApiProperty({ 
    enum: UserRole, 
    example: UserRole.TEACHER, 
    description: 'Роль пользователя',
    required: false 
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ 
    type: [Number], 
    example: [1, 2, 3], 
    description: 'ID предметов, которые ведет учитель',
    required: false 
  })
  @IsArray({ message: 'lessonsIds должен быть массивом' })
  @IsNumber({}, { each: true, message: 'Каждый элемент lessonsIds должен быть числом' })
  @IsOptional()
  lessonsIds?: number[];
}