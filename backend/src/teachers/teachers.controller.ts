import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Res,
  InternalServerErrorException,
  NotFoundException,
  Request,
  Post,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { TeacherOnly } from '../auth/decorators/teacher.decorator';
import { ProcessDebtRequestDto } from './dto/process-debt-request.dto';
import { UpdateReputationDto } from './dto/update-reputation.dto';

@ApiTags('Учителя')
@ApiBearerAuth()
@Controller('teachers')
@TeacherOnly() // ВСЕ РОУТЫ ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  @Get('students')
  @ApiOperation({ summary: 'Получение всех студентов (только для учителей)' })
  @ApiResponse({ status: 200, description: 'Список студентов' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  getAllStudents() {
    return this.teachersService.getAllStudents();
  }

  // ПОЛУЧЕНИЕ ВСЕХ ГРУПП (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  @Get('groups')
  @ApiOperation({ summary: 'Получение всех групп (только для учителей)' })
  @ApiResponse({ status: 200, description: 'Список групп успешно получен.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  getAllGroups(@Request() req) {
    const adminId = req.user.id;
    return this.teachersService.getAllGroups();
  }

  // ПОЛУЧЕНИЕ ВСЕХ ПРЕДМЕТОВ (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  @Get('lessons')
  @ApiOperation({
    summary: 'Выдача всех учебных предметов (только для учителей)',
  })
  @ApiResponse({ status: 201, description: 'Предметы успешно выданы' })
  @ApiResponse({ status: 400, description: 'Ошибка при выдаче предметов' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async getLessons(@Request() req) {
    const adminId = req.user.id;
    return this.teachersService.getLessons();
  }

  // ПОЛУЧЕНИЕ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТА (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  @Get('students/:id/history')
  @ApiOperation({
    summary: 'Получить историю репутации студента (только для учителей)',
  })
  @ApiResponse({
    status: 200,
    description: 'История репутации успешно получена',
  })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getStudentReputationHistory(@Param('id') id: string) {
    return this.teachersService.getStudentReputationHistory(+id);
  }

  // ПОЛУЧИТЬ EXCEL ФАЙЛ С ИСТОРИЕЙ РЕПУТАЦИИ СТУДЕНТА (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  @Get('students/:id/history/excel')
  @ApiOperation({
    summary:
      'Получить excel файл с историей репутации студента (только для учителей)',
  })
  @ApiResponse({
    status: 200,
    description: 'Excel файл с историей репутации успешно получен',
  })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async downloadStudentReputationHistoryExcel(
    @Param('id') studentId: number,
    @Res() res: Response,
  ) {
    try {
      const buffer =
        await this.teachersService.generateStudentReputationHistoryExcel(
          studentId,
        );
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

  // ДОБАВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТУ
  @Post('students/:id/reputation/add')
  @ApiOperation({ summary: 'Добавление репутации студенту' })
  @ApiResponse({ status: 200, description: 'Репутация успешно добавлена' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async addReputation(
    @Param('id') studentId: string,
    @Request() req,
    @Body() updateReputationDto: UpdateReputationDto,
  ) {
    const teacherId = req.user.id;
    return this.teachersService.addReputation(
      +studentId,
      teacherId,
      updateReputationDto,
    );
  }

  // УБАВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТА
  @Post('students/:id/reputation/remove')
  @ApiOperation({ summary: 'Убавление репутации студента' })
  @ApiResponse({ status: 200, description: 'Репутация успешно списана' })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно репутации для списания',
  })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async removeReputation(
    @Param('id') studentId: string,
    @Request() req,
    @Body() updateReputationDto: UpdateReputationDto,
  ) {
    const teacherId = req.user.id;
    return this.teachersService.removeReputation(
      +studentId,
      teacherId,
      updateReputationDto,
    );
  }

  // ПОЛУЧЕНИЕ ВСЕХ ЗАЯВОК ДЛЯ УЧИТЕЛЯ
  @Get('debt-requests')
  @ApiOperation({ summary: 'Получение всех заявок на списание' })
  @ApiResponse({ status: 200, description: 'Список заявок получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getDebtRequests(@Request() req) {
    const teacherId = req.user.id;
    return this.teachersService.getTeacherDebtRequests(teacherId);
  }

  // ПОЛУЧЕНИЕ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О ЗАЯВКЕ
  @Get('debt-requests/:id')
  @ApiOperation({ summary: 'Получение детальной информации о заявке' })
  @ApiResponse({ status: 200, description: 'Информация о заявке получена' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getDebtRequestDetails(@Param('id') id: string, @Request() req) {
    const teacherId = req.user.id;
    return this.teachersService.getDebtRequestDetails(+id, teacherId);
  }

  // ПРИНЯТИЕ ЗАЯВКИ
  @Patch('debt-requests/:id/accept')
  @ApiOperation({ summary: 'Принятие заявки на списание' })
  @ApiResponse({
    status: 200,
    description: 'Заявка принята, репутация списана',
  })
  @ApiResponse({
    status: 400,
    description: 'Недостаточно репутации или заявка уже обработана',
  })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async acceptDebtRequest(
    @Param('id') id: string,
    @Request() req,
    @Body() processDto: ProcessDebtRequestDto,
  ) {
    const teacherId = req.user.id;
    return this.teachersService.acceptDebtRequest(
      +id,
      teacherId,
      processDto.comment,
    );
  }

  // ОТКЛОНЕНИЕ ЗАЯВКИ
  @Patch('debt-requests/:id/reject')
  @ApiOperation({ summary: 'Отклонение заявки на списание' })
  @ApiResponse({ status: 200, description: 'Заявка отклонена' })
  @ApiResponse({ status: 400, description: 'Заявка уже обработана' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Заявка не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async rejectDebtRequest(
    @Param('id') id: string,
    @Request() req,
    @Body() processDto: ProcessDebtRequestDto,
  ) {
    const teacherId = req.user.id;
    return this.teachersService.rejectDebtRequest(
      +id,
      teacherId,
      processDto.comment,
    );
  }
}
