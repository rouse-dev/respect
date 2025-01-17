import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

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
      throw new InternalServerErrorException (error);
    }
  }

  // ЛОГИРОВАНИЕ УЧИТЕЛЯ
  async login(email: string, password: string) {
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
  
      return { accessToken };

    } catch (error) {
      throw new InternalServerErrorException (error);
    }
  }
}
