import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, StudentResponseDto } from './dto/create-student.dto';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ СТУДЕНТА
  async create(createStudentDto: CreateStudentDto) {
    try {
      return this.prisma.student.create({
        data: createStudentDto,
        include: {
          groups: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ МНОЖЕСТВА СТУДЕНТОВ
  async createMany(
    students: CreateStudentDto[],
  ): Promise<StudentResponseDto[]> {
    try {
      const createdStudents = await Promise.all(
        students.map((student) =>
          this.prisma.student.create({
            data: student,
            include: {
              groups: true, // Включаем данные о группе
            },
          }),
        ),
      );
      return createdStudents;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ
  async findAll() {
    try {
      return this.prisma.student.findMany({
        include: {
          groups: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ИСТОРИЮ РЕПУТАЦИИ СТУДЕНТА ПО ЕГО АЙДИ (ПЕРЕДАЕТСЯ ЧЕРЕЗ ПАРАМЕТР)
  async getReputationHistory(studentId: number) {
    try {
      // ИЩЕМ СТУДЕНТА С ИСТОРИЕЙ РЕПУТАЦИИ И НАЗВАНИЕМ ПРЕДМЕТА
      const student = await this.prisma.student.findUnique({
        where: { id: +studentId },
        include: {
          historyReps: {
            include: {
              lesson: true,
            },
          },
        },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      // ФОРМАТИРУЕМ ОТВЕТ, ЧТОБЫ ВКЛЮЧИТЬ НАЗВАНИЕ ПРЕДМЕТА
      const formattedHistory = student.historyReps.map((record) => ({
        id: record.id,
        change: record.change,
        reason: record.reason,
        createdAt: record.createdAt,
        lesson: record.lesson ? record.lesson.name : null, // НАЗВАНИЕ ПРЕДМЕТА (ЕСЛИ ЕСТЬ)
      }));

      return formattedHistory;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ошибка при получении истории репутации',
      );
    }
  }

  // ПОЛУЧЕНИЕ EXCEL ФАЙЛА ДЛЯ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТ
  async downloadReputationHistoryExcel(studentId: number, res: Response) {
    try {
      const history = await this.getReputationHistory(studentId);
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('История репутации');

      worksheet.columns = [
        { header: 'ID', key: 'id', width: 10 },
        { header: 'Изменение репутации', key: 'change', width: 20 },
        { header: 'Причина', key: 'reason', width: 30 },
        { header: 'Дата изменения', key: 'createdAt', width: 20 },
        { header: 'Предмет', key: 'lesson', width: 20 },
      ];

      history.forEach((record) => {
        worksheet.addRow({
          id: record.id,
          change: record.change,
          reason: record.reason,
          createdAt: record.createdAt,
          lesson: record.lesson,
        });
      });

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=reputation_history_${studentId}.xlsx`,
      );

      const buffer = await workbook.xlsx.writeBuffer();
      res.send(Buffer.from(buffer));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Ошибка при создании Excel-файла');
    }
  }

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  async updateReputation(
    studentId: number,
    change: number,
    reason?: string,
    lessonId?: number,
    isPunish?: boolean,
  ) {
    try {
      // ПРОВЕРЯЕМ, СУЩЕСТВУЕТ ЛИ СТУДЕНТ
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      // ЕСЛИ ПЕРЕДАН lessonId, ПРОВЕРЯЕМ, СУЩЕСТВУЕТ ЛИ ПРЕДМЕТ
      if (lessonId) {
        const lesson = await this.prisma.lessons.findUnique({
          where: { id: lessonId },
        });

        if (!lesson) {
          throw new NotFoundException('Предмет не найден');
        }
      }

      // ОБНОВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТА
      if (!isPunish && change < 0 && student.reputation - -change < 0) {
        throw new InternalServerErrorException('Не хватает репутации!');
      }

      const updatedStudent = await this.prisma.student.update({
        where: { id: studentId },
        data: {
          reputation: {
            increment: change, // УВЕЛИЧИВАЕМ ИЛИ УМЕНЬШАЕМ РЕПУТАЦИЮ
          },
        },
      });

      // ДОБАВЛЯЕМ ЗАПИСЬ В ИСТОРИЮ РЕПУТАЦИЙ
      await this.prisma.historyRep.create({
        data: {
          studentId,
          change,
          reason,
          lessonId,
        },
      });

      return updatedStudent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
