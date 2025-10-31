import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'newuser@example.com', description: 'Новый email', required: false })
  @IsEmail({}, { message: 'Некорректный email' })
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя пользователя', required: false })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Новый пароль', required: false })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть не менее 6 символов' })
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'oldpassword123', description: 'Старый пароль (требуется при смене пароля)', required: false })
  @IsString({ message: 'Старый пароль должен быть строкой' })
  @IsOptional()
  oldPassword?: string;
}