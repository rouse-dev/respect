import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.jwt || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { email: string; sub: number; isStudent: boolean; role: string }) {
    try {
      let user;

      if (payload.isStudent) {
        // Если студент, ищем в таблице студентов
        user = await this.studentsRepository.findOne({ 
          where: { id: payload.sub },
          relations: ['groups']
        });

        if (user) {
          // Преобразуем студента в объект пользователя
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: 'student',
            reputation: user.reputation,
            groups: user.groups,
          };
        }
      } else {
        // Если не студент, ищем в таблице пользователей
        user = await this.usersRepository.findOne({ where: { id: payload.sub } });

        if (user) {
          return {
            ...user,
            isStudent: false
          };
        }
      }

      if (!user) {
        throw new UnauthorizedException('Вы не зарегистрированы!');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Вы не зарегистрированы!');
    }
  }
}