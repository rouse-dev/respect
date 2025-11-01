import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  CreateStudentDto,
  CreateManyStudentsDto,
  StudentResponseDto,
} from './dto/create-student.dto';
import { Student } from 'src/entities/student.entity';
import { Group } from 'src/entities/group.entity';
import { Lesson } from 'src/entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  // РЕГИСТРАЦИЯ НОВОГО ПОЛЬЗОВАТЕЛЯ (ТОЛЬКО ДЛЯ АДМИНОВ)
  async registerUser(adminId: number, registerUserDto: RegisterUserDto) {
    try {
      // Проверяем что текущий пользователь - админ
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут регистрировать пользователей',
        );
      }

      // Проверяем существование пользователя
      const existingUser = await this.usersRepository.findOne({
        where: { email: registerUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }

      // Если указаны предметы, проверяем их существование
      let lessons: Lesson[] = [];
      if (registerUserDto.lessonsIds && registerUserDto.lessonsIds.length > 0) {
        lessons = await this.lessonsRepository.findByIds(
          registerUserDto.lessonsIds,
        );

        // Проверяем что все предметы найдены
        if (lessons.length !== registerUserDto.lessonsIds.length) {
          const foundIds = lessons.map((lesson) => lesson.id);
          const notFoundIds = registerUserDto.lessonsIds.filter(
            (id) => !foundIds.includes(id),
          );
          throw new NotFoundException(
            `Предметы с ID: ${notFoundIds.join(', ')} не найдены`,
          );
        }
      }

      const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);

      // Создаем пользователя
      const user = this.usersRepository.create({
        email: registerUserDto.email,
        password: hashedPassword,
        name: registerUserDto.name,
        role: registerUserDto.role || UserRole.TEACHER,
        lessons: lessons, // Добавляем связь с предметами
      });

      await this.usersRepository.save(user);

      // Загружаем пользователя с отношениями для возврата
      const savedUser = await this.usersRepository.findOne({
        where: { id: user.id },
        relations: ['lessons'],
      });

      // Не возвращаем пароль
      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  // МЕТОД ДЛЯ ДОБАВЛЕНИЯ ПРЕДМЕТА ДЛЯ УЧИТЕЛЯ
  async addLessonsToUser(userId: number, lessonsIds: number[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['lessons'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем что пользователь - учитель
    if (user.role !== UserRole.TEACHER) {
      throw new ForbiddenException('Только учителя могут иметь предметы');
    }

    const lessons = await this.lessonsRepository.findByIds(lessonsIds);

    // Проверяем что все предметы найдены
    if (lessons.length !== lessonsIds.length) {
      const foundIds = lessons.map((lesson) => lesson.id);
      const notFoundIds = lessonsIds.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Предметы с ID: ${notFoundIds.join(', ')} не найдены`,
      );
    }

    // Добавляем предметы (объединяем существующие с новыми)
    user.lessons = [...new Set([...user.lessons, ...lessons])];
    await this.usersRepository.save(user);

    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['lessons'],
    });
  }

  // МЕТОД ДЛЯ УДАЛЕНИЯ ПРЕДМЕТОВ У УЧИТЕЛЯ
  async removeLessonsFromUser(userId: number, lessonsIds: number[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['lessons'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Фильтруем предметы, оставляем только те, которые не в списке на удаление
    user.lessons = user.lessons.filter(
      (lesson) => !lessonsIds.includes(lesson.id),
    );
    await this.usersRepository.save(user);

    return this.usersRepository.findOne({
      where: { id: userId },
      relations: ['lessons'],
    });
  }

  // ПОЛУЧЕНИЕ ВСЕХ ПОЛЬЗОВАТЕЛЕЙ (ТОЛЬКО ДЛЯ АДМИНОВ)
  async getAllUsers(adminId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут просматривать пользователей',
        );
      }

      const users = await this.usersRepository.find({
        select: [
          'id',
          'email',
          'name',
          'role',
          'avatar',
          'createdAt',
          'updatedAt',
        ],
      });

      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ПОЛЬЗОВАТЕЛЯ ПО ID (ТОЛЬКО ДЛЯ АДМИНОВ)
  async getUserById(adminId: number, userId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут просматривать пользователей',
        );
      }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
        select: [
          'id',
          'email',
          'name',
          'role',
          'avatar',
          'createdAt',
          'updatedAt',
        ],
      });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОБНОВЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (ТОЛЬКО ДЛЯ АДМИНОВ)
  async updateUser(
    adminId: number,
    userId: number,
    updateUserDto: UpdateUserDto,
  ) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут обновлять пользователей',
        );
      }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      let updateData: any = { ...updateUserDto };

      // Если меняется пароль, хешируем его
      if (updateUserDto.password) {
        updateData.password = await bcrypt.hash(updateUserDto.password, 10);
      }

      await this.usersRepository.update(userId, updateData);

      const updatedUser = await this.usersRepository.findOne({
        where: { id: userId },
        select: [
          'id',
          'email',
          'name',
          'role',
          'avatar',
          'createdAt',
          'updatedAt',
        ],
      });

      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УДАЛЕНИЕ ПОЛЬЗОВАТЕЛЯ (ТОЛЬКО ДЛЯ АДМИНОВ)
  async deleteUser(adminId: number, userId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут удалять пользователей',
        );
      }

      // Нельзя удалить самого себя
      if (adminId === userId) {
        throw new ForbiddenException('Нельзя удалить свой собственный аккаунт');
      }

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      await this.usersRepository.remove(user);

      return { message: 'Пользователь успешно удален' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ СТУДЕНТА С АВТОГЕНЕРАЦИЕЙ ДАННЫХ
  async createStudent(adminId: number, createStudentDto: CreateStudentDto) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут создавать студентов',
        );
      }

      if (createStudentDto.name.trim() === '' || !createStudentDto.groupsId) {
        throw new BadRequestException('Заполните все обязательные поля!');
      }

      // Проверяем существование группы
      const group = await this.groupsRepository.findOne({
        where: { id: createStudentDto.groupsId },
      });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      // Генерируем уникальный email
      const email = await this.generateUniqueStudentEmail(
        createStudentDto.name,
        group.name,
      );

      // Генерируем случайный пароль
      const password = this.generateRandomPassword();

      const hashedPassword = await bcrypt.hash(password, 10);

      const student = this.studentsRepository.create({
        name: createStudentDto.name,
        email: email,
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

      const result = this.mapToStudentResponseDto(savedStudent);

      // Добавляем сгенерированные данные для отображения
      return {
        ...result,
        generatedEmail: email,
        generatedPassword: password,
        message: 'Студент успешно создан. Сохраните данные для входа!',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ МНОЖЕСТВА СТУДЕНТОВ
  async createManyStudents(
    adminId: number,
    createManyStudentsDto: CreateManyStudentsDto,
  ) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут создавать студентов',
        );
      }

      const createdStudents = await Promise.all(
        createManyStudentsDto.students.map(async (studentDto) => {
          if (studentDto.name.trim() !== '' && studentDto.groupsId) {
            return await this.createStudent(adminId, studentDto);
          }
          return null;
        }),
      );

      return createdStudents.filter((student) => student !== null);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ВСЕХ СТУДЕНТОВ
  async getAllStudents(adminId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут просматривать студентов',
        );
      }

      const students = await this.studentsRepository.find({
        relations: ['groups'],
      });

      return students.map((student) => this.mapToStudentResponseDto(student));
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ СТУДЕНТА ПО ID
  async getStudentById(adminId: number, studentId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут просматривать студентов',
        );
      }

      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
        relations: ['groups'],
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      return this.mapToStudentResponseDto(student);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОБНОВЛЕНИЕ СТУДЕНТА
  async updateStudent(
    adminId: number,
    studentId: number,
    updateStudentDto: UpdateUserDto,
  ) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут обновлять студентов',
        );
      }

      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      let updateData: any = { ...updateStudentDto };

      if (updateStudentDto.password) {
        updateData.password = await bcrypt.hash(updateStudentDto.password, 10);
      }

      await this.studentsRepository.update(studentId, updateData);

      const updatedStudent = await this.studentsRepository.findOne({
        where: { id: studentId },
        relations: ['groups'],
      });

      return this.mapToStudentResponseDto(updatedStudent);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УДАЛЕНИЕ СТУДЕНТА
  async deleteStudent(adminId: number, studentId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут удалять студентов',
        );
      }

      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      await this.studentsRepository.remove(student);

      return { message: 'Студент успешно удален' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ПОЛУЧЕНИЕ ДАННЫХ ДЛЯ ВХОДА СТУДЕНТА
  async getStudentCredentials(adminId: number, studentId: number) {
    try {
      const admin = await this.usersRepository.findOne({
        where: { id: adminId },
      });
      if (!admin || admin.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'Только администраторы могут просматривать данные для входа',
        );
      }

      const student = await this.studentsRepository.findOne({
        where: { id: studentId },
        select: ['id', 'name', 'email'],
      });

      if (!student) {
        throw new NotFoundException('Студент не найден');
      }

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        message: 'Данные для входа студента',
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ГЕНЕРАЦИЯ УНИКАЛЬНОГО EMAIL ДЛЯ СТУДЕНТА
  private async generateUniqueStudentEmail(
    name: string,
    groupName: string,
  ): Promise<string> {
    const baseName = name
      .toLowerCase()
      .replace(/[^a-zа-яё\s]/g, '') // Убираем спецсимволы
      .replace(/\s+/g, '.') // Заменяем пробелы на точки
      .substring(0, 15); // Ограничиваем длину

    const baseGroup = groupName
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]/g, '') // Убираем спецсимволы, оставляем буквы и цифры
      .substring(0, 10);

    let email: string;
    let counter = 1;

    do {
      const suffix = counter === 1 ? '' : `.${counter}`;
      email = `${baseName}.${baseGroup}${suffix}@edu.ru`;
      counter++;
    } while (
      (await this.studentsRepository.findOne({ where: { email } })) &&
      counter < 100
    );

    return email;
  }

  // ГЕНЕРАЦИЯ СЛУЧАЙНОГО ПАРОЛЯ
  private generateRandomPassword(): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';

    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
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

  // СОЗДАНИЕ ГРУППЫ
  async createGroup(dto: CreateGroupDto) {
    try {
      const group = this.groupsRepository.create({
        name: dto.name,
      });

      return await this.groupsRepository.save(group);
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

  // НАЙТИ ГРУППУ ПО АЙДИ
  async getGroupById(id: number) {
    try {
      const group = await this.groupsRepository.findOne({
        where: { id },
        relations: ['students'],
      });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      return group;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОБНОВИТЬ ГРУППУ ПО АЙДИ
  async updateGroup(id: number, dto: UpdateGroupDto) {
    try {
      if (dto.name.trim() === '') {
        throw new NotFoundException('Поле пустое');
      }

      const group = await this.groupsRepository.findOne({ where: { id } });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      group.name = dto.name;
      return await this.groupsRepository.save(group);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УДАЛИТЬ ГРУППУ ПО АЙДИ
  async deleteGroup(id: number) {
    try {
      const group = await this.groupsRepository.findOne({ where: { id } });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      return await this.groupsRepository.remove(group);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // СОЗДАНИЕ НОВОГО ПРЕДМЕТА
  async createLesson(createLessonDto: CreateLessonDto) {
    if (createLessonDto.name.trim() === '') {
      throw new InternalServerErrorException('Пустое поле предмета!');
    }

    const lesson = this.lessonsRepository.create(createLessonDto);
    return await this.lessonsRepository.save(lesson);
  }

  // ВЫДАЧА ВСЕХ ПРЕДМЕТОВ
  async getLessons() {
    return await this.lessonsRepository.find();
  }

  // ОБНОВЛЕНИЕ ПРЕДМЕТА
  async updateLesson(id: number, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }

    if (updateLessonDto.name.trim() === '') {
      throw new NotFoundException('Название предмета не может быть пустым');
    }

    lesson.name = updateLessonDto.name;
    return await this.lessonsRepository.save(lesson);
  }

  // УДАЛЕНИЕ ПРЕДМЕТА
  async removeLesson(id: number) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });

    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }

    return await this.lessonsRepository.remove(lesson);
  }
}
