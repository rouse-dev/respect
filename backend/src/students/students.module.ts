import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from '../entities/student.entity';
import { Group } from '../entities/group.entity';
import { Lesson } from '../entities/lesson.entity';
import { HistoryRep } from '../entities/history-rep.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Group, Lesson, HistoryRep]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}