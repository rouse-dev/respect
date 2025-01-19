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
        data: createStudentDto
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
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
        include: { historyReps: true }, // ВКЛЮЧАЕМ ИСТОРИЮ РЕПУТАЦИИ
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      return student.historyReps;
    } catch (error) {
      return this.prisma.student.findMany();
    }
  }

  // ДОБАВИТЬ / УБАВИТЬ РЕПУТАЦИЮ СТУДЕНТА
  async updateReputation(studentId: number, change: number, reason?: string) {
    try {
      // ПРОВЕРЯЕМ, СУЩЕСТВУЕТ ЛИ СТУДЕНТ
      const student = await this.prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
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
        },
      });

      return updatedStudent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
