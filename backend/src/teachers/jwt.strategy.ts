import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Извлекаем токен из куки
          return request.cookies?.jwt || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string }) {
    try {
      const teacher = await this.prisma.teacher.findUnique({
        where: { email: payload.email },
      });

      if (!teacher) {
        throw new UnauthorizedException('Вы не зарегистрированы!');
      }

      return teacher;
    } catch (error) {
      throw new UnauthorizedException('Вы не зарегистрированы!');
    }
  }
}