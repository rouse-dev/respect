import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Student } from '../entities/student.entity';
import { HistoryRep } from '../entities/history-rep.entity';
import { DebtRequest, RequestStatus } from '../entities/debt-request.entity';
import { UpdateReputationDto } from './dto/update-reputation.dto';
import { Group } from 'src/entities/group.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(HistoryRep)
    private historyRepsRepository: Repository<HistoryRep>,
    @InjectRepository(DebtRequest)
    private debtRequestsRepository: Repository<DebtRequest>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  async getAllStudents(): Promise<Student[]> {
    try {
      return await this.studentsRepository.find({
        relations: ['groups'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТА (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  async getStudentReputationHistory(studentId: number) {
    try {
      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
        relations: ['historyReps', 'historyReps.lesson'],
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      const formattedHistory = student.historyReps.map((record) => ({
        id: record.id,
        change: record.change,
        reason: record.reason,
        createdAt: record.createdAt,
        lesson: record.lesson ? record.lesson.name : null,
        class: record.class ? record.class : '',
      }));

      return formattedHistory;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении истории репутации',
      );
    }
  }

  // ПОЛУЧЕНИЕ EXCEL ФАЙЛА ДЛЯ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТА (ТОЛЬКО ДЛЯ УЧИТЕЛЕЙ)
  async generateStudentReputationHistoryExcel(
    studentId: number,
  ): Promise<ExcelJS.Buffer> {
    try {
      const history = await this.getStudentReputationHistory(studentId);
      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('История репутации');

      worksheet.addRow([student.name]);
      worksheet.mergeCells('A1:E1');

      const mergedCell = worksheet.getCell('A1');
      mergedCell.font = { bold: true, size: 14 };
      mergedCell.alignment = { horizontal: 'center' };

      worksheet.addRow([
        'Предмет',
        'Пара',
        'Изменение репутации',
        'Дата изменения',
        'Причина',
      ]);

      worksheet.columns = [
        { key: 'lesson', width: 20 },
        { key: 'class', width: 20 },
        { key: 'change', width: 25 },
        { key: 'createdAt', width: 20 },
        { key: 'reason', width: 30 },
      ];

      history.forEach((record) => {
        const createdAt =
          typeof record.createdAt === 'string'
            ? new Date(record.createdAt)
            : record.createdAt;

        worksheet.addRow({
          change: record.change ?? '',
          reason: record.reason ?? '',
          createdAt: createdAt ? createdAt.toLocaleString() : '',
          lesson: record.lesson ?? '',
          class: record.class ?? '',
        });
      });

      return await workbook.xlsx.writeBuffer();
    } catch (error) {
      console.error('Ошибка при создании Excel-файла:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ошибка при создании Excel-файла');
    }
  }

  // ДОБАВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТУ
  async addReputation(
    studentId: number,
    teacherId: number,
    updateReputationDto: UpdateReputationDto,
  ) {
    try {
      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      // Добавляем репутацию
      student.reputation += updateReputationDto.points;
      await this.studentsRepository.save(student);

      // Создаем запись в истории репутации
      const historyRep = this.historyRepsRepository.create({
        studentId,
        change: updateReputationDto.points, // Положительное изменение
        reason: updateReputationDto.reason || 'Начисление репутации учителем',
        lessonId: updateReputationDto.lessonId,
        class: updateReputationDto.class,
      });

      await this.historyRepsRepository.save(historyRep);

      return {
        student: {
          id: student.id,
          name: student.name,
          reputation: student.reputation,
        },
        change: updateReputationDto.points,
        message: 'Репутация успешно добавлена',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УБАВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТА
  async removeReputation(
    studentId: number,
    teacherId: number,
    updateReputationDto: UpdateReputationDto,
  ) {
    try {
      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      // Проверяем достаточно ли репутации для списания
      if (student.reputation < updateReputationDto.points) {
        throw new BadRequestException(
          'У студента недостаточно репутации для списания',
        );
      }

      // Убавляем репутацию
      student.reputation -= updateReputationDto.points;
      await this.studentsRepository.save(student);

      // Создаем запись в истории репутации
      const historyRep = this.historyRepsRepository.create({
        studentId,
        change: -updateReputationDto.points, // Отрицательное изменение
        reason: updateReputationDto.reason || 'Списание репутации учителем',
        lessonId: updateReputationDto.lessonId,
        class: updateReputationDto.class,
      });

      await this.historyRepsRepository.save(historyRep);

      return {
        student: {
          id: student.id,
          name: student.name,
          reputation: student.reputation,
        },
        change: -updateReputationDto.points,
        message: 'Репутация успешно списана',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫДАТЬ ВСЕ ГРУППЫ
  async getAllGroups() {
    try {
      return await this.groupsRepository.find({
        relations: ['students'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫДАЧА ВСЕХ ПРЕДМЕТОВ
  async getLessons() {
    return await this.lessonsRepository.find();
  }

  // ПОЛУЧЕНИЕ ВСЕХ ЗАЯВОК ДЛЯ УЧИТЕЛЯ
  async getTeacherDebtRequests(teacherId: number) {
    try {
      return await this.debtRequestsRepository.find({
        where: { teacherId },
        relations: ['student', 'student.groups', 'lesson'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О ЗАЯВКЕ
  async getDebtRequestDetails(requestId: number, teacherId: number) {
    try {
      const debtRequest = await this.debtRequestsRepository.findOne({
        where: { id: requestId, teacherId },
        relations: ['student', 'student.groups', 'lesson'],
      });

      if (!debtRequest) {
        throw new NotFoundException('Заявка не найдена');
      }

      return debtRequest;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПРИНЯТИЕ ЗАЯВКИ
  async acceptDebtRequest(
    requestId: number,
    teacherId: number,
    comment?: string,
  ) {
    try {
      const debtRequest = await this.debtRequestsRepository.findOne({
        where: { id: requestId },
        relations: ['student', 'teacher', 'lesson'],
      });

      if (!debtRequest) {
        throw new NotFoundException('Заявка не найдена');
      }

      // Проверяем что заявка принадлежит учителю
      if (debtRequest.teacherId !== teacherId) {
        throw new ForbiddenException('Вы не можете обрабатывать эту заявку');
      }

      // Проверяем что заявка еще на рассмотрении
      if (debtRequest.status !== RequestStatus.PENDING) {
        throw new BadRequestException('Заявка уже обработана');
      }

      const student = debtRequest.student;

      // Проверяем достаточно ли репутации
      if (student.reputation < debtRequest.points) {
        throw new BadRequestException('У студента недостаточно репутации');
      }

      // Списываем репутацию
      student.reputation -= debtRequest.points;
      await this.studentsRepository.save(student);

      // Создаем запись в истории репутации
      const historyRep = this.historyRepsRepository.create({
        studentId: debtRequest.studentId,
        change: -debtRequest.points, // Отрицательное изменение
        reason: `Списание по заявке: ${debtRequest.description || 'без описания'}`,
        lessonId: debtRequest.lessonId,
        class: null,
      });

      await this.historyRepsRepository.save(historyRep);

      // Обновляем статус заявки
      debtRequest.status = RequestStatus.APPROVED;
      debtRequest.teacherComment = comment || 'Заявка одобрена';

      return await this.debtRequestsRepository.save(debtRequest);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОТКЛОНЕНИЕ ЗАЯВКИ
  async rejectDebtRequest(
    requestId: number,
    teacherId: number,
    comment?: string,
  ) {
    try {
      const debtRequest = await this.debtRequestsRepository.findOne({
        where: { id: requestId },
        relations: ['student', 'teacher', 'lesson'],
      });

      if (!debtRequest) {
        throw new NotFoundException('Заявка не найдена');
      }

      // Проверяем что заявка принадлежит учителю
      if (debtRequest.teacherId !== teacherId) {
        throw new ForbiddenException('Вы не можете обрабатывать эту заявку');
      }

      // Проверяем что заявка еще на рассмотрении
      if (debtRequest.status !== RequestStatus.PENDING) {
        throw new BadRequestException('Заявка уже обработана');
      }

      // Обновляем статус заявки
      debtRequest.status = RequestStatus.REJECTED;
      debtRequest.teacherComment = comment || 'Заявка отклонена';

      return await this.debtRequestsRepository.save(debtRequest);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
