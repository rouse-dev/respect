import { Controller, Get, Post, Body, Param, Patch, UseGuards, Res, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateManyStudentsDto, CreateStudentDto, StudentResponseDto } from './dto/create-student.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Студенты')
@ApiBearerAuth()
@Controller('students')
@UseGuards(AuthGuard('jwt')) // JWT ЗАЩИТА ДЛЯ ВСЕХ РОУТОВ СТУДЕНТОВ
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  // СОЗДАНИЕ СТУДЕНТА
  @Post()
  @ApiOperation({ summary: 'Создание студента' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Студент успешно создан' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  // СОЗДАНИЕ МНОЖЕСТВА СТУДЕНТОВ
  @Post('many')
  @ApiOperation({ summary: 'Создание множества студентов' })
  @ApiBody({ type: CreateManyStudentsDto })
  @ApiResponse({ status: 201, description: 'Студенты успешно созданы', type: [StudentResponseDto] })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async createMany(@Body() createManyStudentsDto: CreateManyStudentsDto) {
    return this.studentsService.createMany(createManyStudentsDto.students);;
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
  @ApiOperation({ summary: 'Получить историю репутации студента' })
  @ApiResponse({ status: 200, description: 'История репутации успешно получена' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getReputationHistory(@Param('id') id: string) {
    return this.studentsService.getReputationHistory(+id);
  }

  // ПОЛУЧИТЬ EXCEL ФАЙЛ С ИСТОРИЕЙ РЕПУТАЦИИ СТУДЕНТА ПО ЕГО АЙДИ (ПЕРЕДАЕТСЯ ЧЕРЕЗ ПАРАМЕТР)
  @Get(':id/history/excel')
  @ApiOperation({ summary: 'Получить excel файл с историей репутации студента' })
  @ApiResponse({ status: 200, description: 'Excel файл с историей репутации успешно получен' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async downloadReputationHistoryExcel(@Param('id') studentId: number, @Res() res: Response) {
    try {
      const buffer = await this.studentsService.generateReputationHistoryExcel(studentId);
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="reputation_history_${studentId}.xlsx"`,
      );
      res.send(buffer);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ошибка при скачивании файла');
    }
  }

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  @Patch(':id/reputation')
  @ApiOperation({ summary: 'Изменение репутации студента' })
  @ApiResponse({ status: 200, description: 'Репутация успешно изменена' })
  @ApiResponse({ status: 401, description: 'Требуется авторизация' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  updateReputation(
    @Param('id') id: string,
    @Body('change') change: number,
    @Body('reason') reason?: string,
    @Body('lessonId') lessonId?: number,
    @Body('isPunish') isPunish?: boolean,
    @Body('newLesson') newLesson?: string
  ) {
    return this.studentsService.updateReputation(+id, change, reason, lessonId, isPunish, newLesson);
  }
}
