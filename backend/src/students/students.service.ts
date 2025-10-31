import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as bcrypt from 'bcrypt';
import { Student } from '../entities/student.entity';
import { Group } from '../entities/group.entity';
import { Lesson } from '../entities/lesson.entity';
import { HistoryRep } from '../entities/history-rep.entity';
import { CreateStudentDto, StudentResponseDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    @InjectRepository(HistoryRep)
    private historyRepsRepository: Repository<HistoryRep>,
  ) {}

  // СОЗДАНИЕ СТУДЕНТА
  async create(createStudentDto: CreateStudentDto): Promise<StudentResponseDto> {
    try {
      if (createStudentDto.name.trim() === '' || !createStudentDto.groupsId) {
        throw new InternalServerErrorException('Заполните все строки!');
      }

      // Проверяем существование группы
      const group = await this.groupsRepository.findOne({ 
        where: { id: createStudentDto.groupsId } 
      });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

      const student = this.studentsRepository.create({
        name: createStudentDto.name,
        email: createStudentDto.email,
        password: hashedPassword,
        groupsId: createStudentDto.groupsId,
        avatar: createStudentDto.avatar || 'uploads/avatars/default.jpg',
        reputation: createStudentDto.reputation || 0,
      });

      await this.studentsRepository.save(student);

      // Загружаем студента с отношениями
      const savedStudent = await this.studentsRepository.findOne({
        where: { id: student.id },
        relations: ['groups'],
      });

      return this.mapToStudentResponseDto(savedStudent);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ МНОЖЕСТВА СТУДЕНТОВ
  async createMany(students: CreateStudentDto[]): Promise<StudentResponseDto[]> {
    try {
      const createdStudents = await Promise.all(
        students.map(async (studentDto) => {
          if (studentDto.name.trim() !== '' && studentDto.groupsId) {
            return await this.create(studentDto);
          }
          return null;
        }),
      );

      return createdStudents.filter(student => student !== null);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ
  async findAll(): Promise<StudentResponseDto[]> {
    try {
      const students = await this.studentsRepository.find({
        relations: ['groups'],
      });

      return students.map(student => this.mapToStudentResponseDto(student));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТА
  async getReputationHistory(studentId: number) {
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
      throw new InternalServerErrorException('Ошибка при получении истории репутации');
    }
  }

  // ПОЛУЧЕНИЕ EXCEL ФАЙЛА ДЛЯ ИСТОРИИ РЕПУТАЦИИ СТУДЕНТА
  async generateReputationHistoryExcel(studentId: number): Promise<ExcelJS.Buffer> {
    try {
      const history = await this.getReputationHistory(studentId);
      const student = await this.studentsRepository.findOne({ where: { id: studentId } });
      
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
        const createdAt = typeof record.createdAt === 'string' 
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
  async changeStud(id: number, dto: UpdateStudentDto): Promise<StudentResponseDto> {
    try {
      if (dto.name && dto.name.trim() === "") {
        throw new NotFoundException("Строка пуста");
      }

      const student = await this.studentsRepository.findOne({ 
        where: { id },
        relations: ['groups'],
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      let updateData: any = { ...dto };

      if (dto.password) {
        updateData.password = await bcrypt.hash(dto.password, 10);
      }

      // Обновляем студента
      await this.studentsRepository.update(id, updateData);

      // Получаем обновленного студента
      const updatedStudent = await this.studentsRepository.findOne({
        where: { id },
        relations: ['groups'],
      });

      return this.mapToStudentResponseDto(updatedStudent);
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при изменении студента');
    }
  }

  // УДАЛИТЬ СТУДЕНТА
  async deleteStud(id: number) {
    try {
      const student = await this.studentsRepository.findOne({ where: { id } });
      
      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      return await this.studentsRepository.remove(student);
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
      const student = await this.studentsRepository.findOne({ where: { id: studentId } });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      let finalLessonId = lessonId;

      if (lessonId !== -1) {
        const lesson = await this.lessonsRepository.findOne({ where: { id: lessonId } });

        if (!lesson) {
          throw new NotFoundException('Предмет не найден');
        }
      } else {
        if (!newLesson) {
          throw new BadRequestException('Необходимо указать новый предмет');
        }

        let existingLesson = await this.lessonsRepository.findOne({ 
          where: { name: newLesson } 
        });

        if (!existingLesson) {
          existingLesson = this.lessonsRepository.create({ name: newLesson });
          await this.lessonsRepository.save(existingLesson);
        }

        finalLessonId = existingLesson.id;
      }

      if (!isPunish && change < 0 && student.reputation + change < 0) {
        throw new BadRequestException('Не хватает репутации!');
      }

      // Обновляем репутацию
      student.reputation += change;
      await this.studentsRepository.save(student);

      // Создаем запись в истории
      const historyRep = this.historyRepsRepository.create({
        studentId,
        change,
        reason,
        lessonId: finalLessonId,
        class: correctClass,
        createdAt: correctDate ? new Date(correctDate) : new Date(),
      });

      await this.historyRepsRepository.save(historyRep);

      return student;
    } catch (error) {
      console.error('Ошибка при обновлении репутации:', error);
      throw new InternalServerErrorException('Произошла ошибка при обновлении репутации');
    }
  }

  // ВСПОМОГАТЕЛЬНЫЙ МЕТОД ДЛЯ ПРЕОБРАЗОВАНИЯ В StudentResponseDto
  private mapToStudentResponseDto(student: Student): StudentResponseDto {
    return {
      id: student.id,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      reputation: student.reputation,
      groupsId: student.groupsId,
      groups: {
        id: student.groups.id,
        name: student.groups.name,
      },
      createdAt: student.createdAt,
    };
  }
}