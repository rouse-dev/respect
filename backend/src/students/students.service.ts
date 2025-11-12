import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtRequest, RequestStatus } from '../entities/debt-request.entity';
import { Student } from '../entities/student.entity';
import { Lesson } from '../entities/lesson.entity';
import { User } from '../entities/user.entity';
import { CreateDebtRequestDto } from './dto/create-debt-request.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(DebtRequest)
    private debtRequestRepository: Repository<DebtRequest>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // ПОЛУЧЕНИЕ ИСТОРИИ РЕПУТАЦИИ ДЛЯ СТУДЕНТА
  async getStudentHistory(studentId: number) {
    try {
      const student = await this.studentRepository.findOne({
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

  // СОЗДАНИЕ ЗАЯВКИ НА СПИСАНИЕ ДОЛГА
  async createDebtRequest(
    studentId: number,
    createDebtRequestDto: CreateDebtRequestDto,
  ) {
    // Проверяем существование студента
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Студент не найден');
    }

    // Проверяем существование предмета
    const lesson = await this.lessonRepository.findOne({
      where: { id: createDebtRequestDto.lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Предмет не найден');
    }

    // Проверяем, что у студента достаточно репутации
    if (student.reputation < createDebtRequestDto.points) {
      throw new BadRequestException('Недостаточно репутации для списания');
    }

    // Создаем заявку
    const debtRequest = this.debtRequestRepository.create({
      studentId,
      teacherId: lesson.teacher_id,
      lessonId: createDebtRequestDto.lessonId,
      points: createDebtRequestDto.points,
      description: createDebtRequestDto.description,
      status: RequestStatus.PENDING,
    });

    return await this.debtRequestRepository.save(debtRequest);
  }

  // ПОЛУЧЕНИЕ ИСТОРИИ ЗАЯВОК СТУДЕНТА
  async getDebtRequestsHistory(studentId: number) {
    // Проверяем существование студента
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException('Студент не найден');
    }

    const debtRequests = await this.debtRequestRepository.find({
      where: { studentId },
      relations: ['lesson', 'teacher'],
      order: { createdAt: 'DESC' },
    });

    return debtRequests.map((request) => ({
      id: request.id,
      lesson: request.lesson ? request.lesson.name : 'Неизвестный предмет',
      points: request.points,
      status: request.status,
      description: request.description,
      teacherComment: request.teacherComment,
      createdAt: request.createdAt,
    }));
  }

  // ПОЛУЧЕНИЕ ДЕТАЛЬНОЙ ИНФОРМАЦИИ О ЗАЯВКЕ
  async getDebtRequestById(studentId: number, requestId: number) {
    const debtRequest = await this.debtRequestRepository.findOne({
      where: { id: requestId },
      relations: ['lesson', 'teacher', 'student'],
    });

    if (!debtRequest) {
      throw new NotFoundException('Заявка не найдена');
    }

    // Проверяем, что заявка принадлежит студенту
    if (debtRequest.studentId !== studentId) {
      throw new ForbiddenException('Нет доступа к этой заявке');
    }

    return {
      id: debtRequest.id,
      lesson: debtRequest.lesson
        ? {
            id: debtRequest.lesson.id,
            name: debtRequest.lesson.name,
          }
        : null,
      points: debtRequest.points,
      status: debtRequest.status,
      description: debtRequest.description,
      teacherComment: debtRequest.teacherComment,
      createdAt: debtRequest.createdAt,
      teacher: debtRequest.teacher
        ? {
            id: debtRequest.teacher.id,
            name: debtRequest.teacher.name,
          }
        : null,
      student: {
        id: debtRequest.student.id,
        name: debtRequest.student.name,
        reputation: debtRequest.student.reputation,
      },
    };
  }
}
