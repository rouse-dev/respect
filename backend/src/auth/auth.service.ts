import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // ВАЛИДАЦИЯ ПОЛЬЗОВАТЕЛЯ ИЛИ СТУДЕНТА
  async validateUser(email: string, password: string) {
    try {
      // Сначала ищем в таблице users (учителя/админы)
      let user = await this.usersRepository.findOne({ where: { email } });
      let isStudent = false;

      // Если не нашли в users, ищем в students
      if (!user) {
        const student = await this.studentsRepository.findOne({ 
          where: { email },
          relations: ['groups']
        });
        
        if (student) {
          const isPasswordValid = await bcrypt.compare(password, student.password);
          
          if (!isPasswordValid) {
            throw new UnauthorizedException('Неверный email или пароль');
          }

          // Создаем объект пользователя из студента
          user = {
            id: student.id,
            email: student.email,
            name: student.name,
            avatar: student.avatar,
            role: 'student',
            password: student.password,
            createdAt: student.createdAt,
            updatedAt: student.createdAt,
            debtRequests: []
          } as User;
        }
      } else {
        // Если нашли в users, проверяем пароль
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          throw new UnauthorizedException('Неверный email или пароль');
        }
      }

      if (!user) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      // Добавляем флаг isStudent в объект пользователя
      return {
        ...user,
        isStudent
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ ИЛИ СТУДЕНТА
  async login(
    email: string,
    password: string,
    response: Response,
  ) {
    try {
      const user = await this.validateUser(email, password);

      const payload = { 
        email: user.email, 
        sub: user.id,
        isStudent: user.isStudent,
        role: user.role
      };
      
      const accessToken = this.jwtService.sign(payload);

      response.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2592000000,
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
          isStudent: user.isStudent
        }
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫХОД ИЗ АККАУНТА
  async logout(response: Response) {
    try {
      response.clearCookie('jwt', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return { message: 'Вы вышли с аккаунта!' };
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  // ЗАМЕНА АВАТАРКИ ПОЛЬЗОВАТЕЛЯ
  async changeAvatar(file: Express.Multer.File, userId: number, isStudent: boolean = false) {
    try {
      let user;

      if (isStudent) {
        user = await this.studentsRepository.findOne({ where: { id: userId } });
      } else {
        user = await this.usersRepository.findOne({ where: { id: userId } });
      }

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = require('path').extname(file.originalname);
      const filename = `uploads/avatars/${uniqueSuffix}${ext}`;

      // СОХРАНЕНИЕ ФАЙЛА НА ДИСК
      const fs = require('fs');
      const path = require('path');
      const uploadPath = path.join(__dirname, '..', '..', filename);

      fs.writeFileSync(uploadPath, file.buffer);

      user.avatar = filename;
      
      if (isStudent) {
        await this.studentsRepository.save(user);
      } else {
        await this.usersRepository.save(user);
      }

      return user;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  // ИЗМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  async changeInfo(userId: number, dto: UpdateUserDto, isStudent: boolean = false) {
    try {
      let user;

      if (isStudent) {
        user = await this.studentsRepository.findOne({ where: { id: userId } });
      } else {
        user = await this.usersRepository.findOne({ where: { id: userId } });
      }

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      let updateData: any = { ...dto };

      if (dto.password) {
        if (!dto.oldPassword) {
          throw new InternalServerErrorException('Требуется старый пароль для смены пароля.');
        }

        const isPasswordValid = await bcrypt.compare(dto.oldPassword, user.password);
        
        if (!isPasswordValid) {
          throw new InternalServerErrorException('Текущий пароль введен неверно!');
        }

        if (dto.password.length < 8) {
          throw new InternalServerErrorException('Пароль должен быть не менее 8 символов.');
        }

        updateData.password = await bcrypt.hash(dto.password, 10);
      }

      delete updateData.oldPassword;

      // Обновляем пользователя
      if (isStudent) {
        await this.studentsRepository.update(userId, updateData);
        user = await this.studentsRepository.findOne({ where: { id: userId } });
      } else {
        await this.usersRepository.update(userId, updateData);
        user = await this.usersRepository.findOne({ where: { id: userId } });
      }

      return user;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Произошла ошибка при обновлении данных.');
    }
  }

  // ВЫДАТЬ ИНФОРМАЦИЮ О ПОЛЬЗОВАТЕЛЕ
  async me(userId: number, isStudent: boolean = false) {
    try {
      let user;

      if (isStudent) {
        user = await this.studentsRepository.findOne({ 
          where: { id: userId },
          relations: ['groups']
        });
        
        if (user) {
          // Преобразуем студента в формат пользователя
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: 'student',
            reputation: user.reputation,
            groups: user.groups,
            isStudent: true,
            createdAt: user.createdAt
          };
        }
      } else {
        user = await this.usersRepository.findOne({ where: { id: userId } });
        
        if (user) {
          // Не возвращаем пароль
          const { password, ...result } = user;
          return {
            ...result,
            isStudent: false
          };
        }
      }

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}