import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // РЕГИСТРАЦИЯ ПОЛЬЗОВАТЕЛЯ
  async register(email: string, password: string, name?: string) {
    try {
      const existingUser = await this.usersRepository.findOne({ where: { email } });

      if (existingUser) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = this.usersRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      await this.usersRepository.save(user);

      return { id: user.id, email: user.email, name: user.name };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВАЛИДАЦИЯ ПОЛЬЗОВАТЕЛЯ
  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ЛОГИРОВАНИЕ ПОЛЬЗОВАТЕЛЯ
  async login(
    email: string,
    password: string,
    response: Response,
  ) {
    try {
      const user = await this.validateUser(email, password);

      const payload = { email: user.email, sub: user.id };
      
      const accessToken = this.jwtService.sign(payload);

      response.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 2592000000,
      });

      return {};
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
}