import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, MinLength, IsNumber } from 'class-validator';

export class UpdateStudentDto {
  @ApiProperty({ example: 'Гумеров Динар', description: 'Имя студента', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'gumerov@example.com', description: 'Email студента', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Пароль студента', required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 1, description: 'ID группы студента', required: false })
  @IsNumber()
  @IsOptional()
  groupsId?: number;

  @ApiProperty({ example: 'uploads/avatars/new-avatar.jpg', description: 'Аватар студента', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: 50, description: 'Репутация студента', required: false })
  @IsNumber()
  @IsOptional()
  reputation?: number;
}