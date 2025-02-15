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
  Res,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
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

@ApiTags('Учителя')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // РЕГИСТРАЦИЯ УЧИТЕЛЯ
  @Post('register')
  @ApiOperation({ summary: 'Регистрация учителя' })
  @ApiBody({ type: RegisterTeacherDto })
  @ApiResponse({ status: 201, description: 'Учитель успешно зарегистрирован' })
  @ApiResponse({
    status: 409,
    description: 'Учитель с таким email уже существует',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async register(@Body() registerTeacherDto: RegisterTeacherDto) {
    return this.teachersService.register(
      registerTeacherDto.email,
      registerTeacherDto.password,
      registerTeacherDto.name,
    );
  }

  // ЛОГИРОВАНИЕ УЧИТЕЛЯ
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Логирование учителя' })
  @ApiBody({ type: LoginTeacherDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, возвращает JWT-токен',
  })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async login(
    @Body() loginTeacherDto: LoginTeacherDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.teachersService.login(
      loginTeacherDto.email,
      loginTeacherDto.password,
      response,
    );
  }

  // ВЫХОД ИЗ АККАУНТА УЧИТЕЛЯ
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Выход из аккаунта учителя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход, cookie с токеном удален',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.teachersService.logout(response);
  }

  // ИЗМЕНЕНИЕ АВАТАРКИ УЧИТЕЛЯ
  @Patch('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Изменение аватарки учителя' })
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
  @ApiBearerAuth() // Указываем, что требуется JWT-токен
  @ApiResponse({ status: 200, description: 'Аватар успешно изменен' }) // Укажите тип возвращаемого объекта
  @ApiResponse({
    status: 400,
    description: 'Некорректный запрос или файл не предоставлен',
  })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
    const teacherId = req.user.id;
    return this.teachersService.changeAvatar(file, teacherId);
  }

    // ВЫВОД ИНФОРМАЦИИ ВОШЕДШЕГО УЧИТЕЛЯ
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Вывод информации вошедшего учителя' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Информация о учителе получена' })
    @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
    @ApiResponse({ status: 404, description: 'Учитель не найден' })
    @ApiResponse({ status: 500, description: 'Ошибка сервера' })
    async getMe(@Request() req) {
      const userId = req.user.id; // Получаем ID из JWT
      return this.teachersService.me(userId);
    }
}
