import {
  Controller,
  Post,
  Body,
  HttpCode,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(
      registerUserDto.email,
      registerUserDto.password,
      registerUserDto.name,
    );
  }

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Логирование пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, возвращает JWT-токен',
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(
      loginUserDto.email,
      loginUserDto.password,
      response,
    );
  }

  // ВЫХОД ИЗ АККАУНТА ПОЛЬЗОВАТЕЛЯ
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Выход из аккаунта пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход, cookie с токеном удален',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}