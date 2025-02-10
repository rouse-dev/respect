import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { Response } from 'express';

@Injectable()
export class TeachersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // РЕГИСТРАЦИЯ УЧИТЕЛЯ
  async register(email: string, password: string, name?: string) {
    try {
      const existingTeacher = await this.prisma.teacher.findUnique({
        where: { email },
      });

      if (existingTeacher) {
        throw new ConflictException('Учитель с таким email уже существует');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teacher = await this.prisma.teacher.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return { id: teacher.id, email: teacher.email, name: teacher.name };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ЛОГИРОВАНИЕ УЧИТЕЛЯ
  async login(
    email: string,
    password: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { email },
      });

      if (!teacher) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      const isPasswordValid = await bcrypt.compare(password, teacher.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      const payload = { email: teacher.email, sub: teacher.id };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      });

      response.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2592000000,
      });

      return { accessToken, teacher };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫХОД ИЗ АККАУНТА
  async logout(@Res({ passthrough: true }) response: Response) {
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

  // ЗАМЕНА АВАТАРКИ УЧИТЕЛЯ
  async changeAvatar(file: Express.Multer.File, teacherId: number) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `uploads/avatars/${uniqueSuffix}${ext}`;

      // СОХРАНЕНИЕ ФАЙЛА НА ДИСК
      const fs = require('fs');
      const path = require('path');
      const uploadPath = path.join(__dirname, '..', '..', filename);

      fs.writeFileSync(uploadPath, file.buffer);

      const updatedTeacher = await this.prisma.teacher.update({
        where: { id: teacherId },
        data: { avatar: filename },
      });

      return updatedTeacher;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
