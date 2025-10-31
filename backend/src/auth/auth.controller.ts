import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Patch,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ИЛИ СТУДЕНТА
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Логирование пользователя или студента' })
  @ApiResponse({
    status: 200,
    description:
      'Успешный вход, возвращает JWT-токен и информацию о пользователе',
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

  // ВЫХОД ИЗ АККАУНТА
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Выход из аккаунта' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход, cookie с токеном удален',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }

  // ИЗМЕНЕНИЕ АВАТАРКИ
  @Patch('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Изменение аватарки пользователя или студента' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Загрузите новый аватар',
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Аватар успешно изменен' })
  @ApiResponse({
    status: 400,
    description: 'Некорректный запрос или файл не предоставлен',
  })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const userId = req.user.id;
    const isStudent = req.user.isStudent || false;
    return this.authService.changeAvatar(file, userId, isStudent);
  }

  // ИЗМЕНЕНИЯ ДАННЫХ
  @Patch('change')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Изменения данных пользователя или студента' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Данные успешно обновлены' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async updateUser(@Request() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;
    const isStudent = req.user.isStudent || false;
    return this.authService.changeInfo(userId, dto, isStudent);
  }

  // ВЫВОД ИНФОРМАЦИИ О ВОШЕДШЕМ ПОЛЬЗОВАТЕЛЕ
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Вывод информации вошедшего пользователя или студента',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Информация о пользователе получена',
  })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async getMe(@Request() req) {
    const userId = req.user.id;
    const isStudent = req.user.isStudent || false;
    return this.authService.me(userId, isStudent);
  }
}
