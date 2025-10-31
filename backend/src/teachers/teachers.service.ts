import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { extname } from 'path';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from './dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // ЗАМЕНА АВАТАРКИ ПОЛЬЗОВАТЕЛЯ
  async changeAvatar(file: Express.Multer.File, userId: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `uploads/avatars/${uniqueSuffix}${ext}`;

      // СОХРАНЕНИЕ ФАЙЛА НА ДИСК
      const fs = require('fs');
      const path = require('path');
      const uploadPath = path.join(__dirname, '..', '..', filename);

      fs.writeFileSync(uploadPath, file.buffer);

      user.avatar = filename;
      await this.usersRepository.save(user);

      return user;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  // ИЗМЕНЕНИЕ ДАННЫХ ПОЛЬЗОВАТЕЛЯ
  async changeInfo(userId: number, dto: UpdateUserDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

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
      await this.usersRepository.update(userId, updateData);
      const updatedUser = await this.usersRepository.findOne({ where: { id: userId } });

      return updatedUser;
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('Произошла ошибка при обновлении данных.');
    }
  }

  // ВЫДАТЬ ИНФОРМАЦИЮ О ПОЛЬЗОВАТЕЛЕ
  async me(userId: number) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      // Не возвращаем пароль
      const { password, ...result } = user;
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }
}