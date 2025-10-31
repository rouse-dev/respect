import {
  Controller,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  Patch,
  Get,
  Body,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
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
import { UpdateUserDto } from './dto/update-teacher.dto';

@ApiTags('Пользователи')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // ИЗМЕНЕНИЕ АВАТАРКИ ПОЛЬЗОВАТЕЛЯ
  @Patch('avatar')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Изменение аватарки пользователя' })
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
    return this.teachersService.changeAvatar(file, userId);
  }

  // ИЗМЕНЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  @Patch('change')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Изменения данных пользователя' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Данные пользователя успешно обновлены' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async updateTeach(@Request() req, @Body() dto: UpdateUserDto) {
    const userId = req.user.id;
    return this.teachersService.changeInfo(userId, dto)
  }

  // ВЫВОД ИНФОРМАЦИИ ВОШЕДШЕГО ПОЛЬЗОВАТЕЛЯ
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Вывод информации вошедшего пользователя' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Информация о пользователе получена' })
  @ApiResponse({ status: 401, description: 'Неавторизованный доступ' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Ошибка сервера' })
  async getMe(@Request() req) {
    const userId = req.user.id;
    return this.teachersService.me(userId);
  }
}