import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { DebtRequest } from '../entities/debt-request.entity';
import { Student } from '../entities/student.entity';
import { HistoryRep } from '../entities/history-rep.entity';
import { Group } from 'src/entities/group.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtRequest, Student, HistoryRep, Group, Lesson]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}