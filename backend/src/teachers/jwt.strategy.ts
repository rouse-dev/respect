import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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