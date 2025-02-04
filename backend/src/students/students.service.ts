import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ СТУДЕНТА
  async create(createStudentDto: CreateStudentDto) {
    try {
      return this.prisma.student.create({
        data: createStudentDto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ МНОЖЕСТВА СТУДЕНТОВ
  async createMany(students: CreateStudentDto[]) {
    try {
      return this.prisma.student.createMany({
        data: students,
      });
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
        where: { id: studentId },
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

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  async updateReputation(
    studentId: number,
    change: number,
    reason?: string,
    lessonId?: number,
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
