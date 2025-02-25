import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto, StudentResponseDto } from './dto/create-student.dto';
import * as ExcelJS from 'exceljs';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ СТУДЕНТА
  async create(createStudentDto: CreateStudentDto) {
    try {
      if (
        createStudentDto.name.trim() === '' ||
        createStudentDto.groupsId === null
      ) {
        throw new InternalServerErrorException('Заполните все строки!');
      }
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
        students.map((student) => {
          if (student.name.trim() !== '' && student.groupsId) {
            return this.prisma.student.create({
              data: student,
              include: {
                groups: true, // Включаем данные о группе
              },
            });
          }
        }),
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

  // ПОЛУЧЕНИЕ EXCEL ФАЙЛА ДЛЯ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТ
  async generateReputationHistoryExcel(
    studentId: number,
  ): Promise<ExcelJS.Buffer> {
    try {
      const history = await this.getReputationHistory(studentId);
      const studentName = await this.prisma.student.findUnique({
        where: { id: +studentId },
      });
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('История репутации');

      worksheet.addRow([studentName.name]);
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

  // ИЗМЕНИТЬ ДАННЫЕ СТУДЕНТА
  async changeStud(id: number, dto: UpdateStudentDto) {
    try {
      if(dto.name.trim() === "") {
        throw new NotFoundException("Строка пуста")
      }
      const updatedStud = await this.prisma.student.update({
        where: { id },
        data: dto,
      });
      return updatedStud;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при изменении студента');
    }
  }

  // УДАЛИТЬ СТУДЕНТА
  async deleteStud(id: number) {
    try {
      const deletedStud = await this.prisma.student.delete({
        where: { id },
      });
      return deletedStud;
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при удалении студента');
    }
  }

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  async updateReputation(
    studentId: number,
    change: number,
    reason?: string,
    lessonId?: number,
    isPunish?: boolean,
    newLesson?: string,
    correctDate?: string,
    correctClass?: number,
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
      if (lessonId !== -1) {
        const lesson = await this.prisma.lessons.findUnique({
          where: { id: lessonId },
        });

        if (!lesson) {
          throw new NotFoundException('Предмет не найден');
        }
      } else {
        if (!newLesson) {
          throw new BadRequestException('Необходимо указать новый предмет');
        }

        // Проверяем, существует ли уже предмет с таким именем
        const existingLesson = await this.prisma.lessons.findFirst({
          where: { name: newLesson },
        });

        if (existingLesson) {
          lessonId = existingLesson.id;
        } else {
          const newLessonRecord = await this.prisma.lessons.create({
            data: {
              name: newLesson,
            },
          });
          lessonId = newLessonRecord.id;
        }
      }

      // ОБНОВЛЕНИЕ РЕПУТАЦИИ СТУДЕНТА
      if (!isPunish && change < 0 && student.reputation + change < 0) {
        throw new BadRequestException('Не хватает репутации!');
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
          class: correctClass,
          createdAt: correctDate ? new Date(correctDate) : new Date(),
        },
      });

      return updatedStudent;
    } catch (error) {
      console.error('Ошибка при обновлении репутации:', error);
      throw new InternalServerErrorException(
        'Произошла ошибка при обновлении репутации',
      );
    }
  }
}
