import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Студенты')
@ApiBearerAuth()
@Controller('students')
@UseGuards(AuthGuard('jwt')) // JWT ЗАЩИТА ДЛЯ ВСЕХ РОУТОВ СТУДЕНТОВ
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // СОЗДАНИЕ СТУДЕНТА
  @Post()
  @ApiOperation({ summary: 'Создание студента' })
  @ApiResponse({ status: 201, description: 'Студент успешно создан' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ
  @Get()
  @ApiOperation({ summary: 'Получение всех студентов' })
  @ApiResponse({ status: 200, description: 'Список студентов' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  findAll() {
    return this.studentsService.findAll();
  }

  // ПОЛУЧЕНИЕ ИСТОРИЮ РЕПУТАЦИИ СТУДЕНТА ПО ЕГО АЙДИ (ПЕРЕДАЕТСЯ ЧЕРЕЗ ПАРАМЕТР)
  @Get(':id/history')
  @ApiOperation({ summary: 'Получение истории репутации студента' })
  @ApiResponse({ status: 200, description: 'История репутации' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  getReputationHistory(@Param('id') id: string) {
    return this.studentsService.getReputationHistory(+id);
  }

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  @Patch(':id/reputation')
  @ApiOperation({ summary: 'Изменение репутации студента' })
  @ApiResponse({ status: 200, description: 'Репутация успешно изменена' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  updateReputation(@Param('id') id: string, @Body('change') change: number, @Body('reason') reason?: string) {
    return this.studentsService.updateReputation(+id, change, reason);
  }
}
