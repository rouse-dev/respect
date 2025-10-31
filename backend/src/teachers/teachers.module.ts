import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { DebtRequest } from '../entities/debt-request.entity';
import { Student } from '../entities/student.entity';
import { HistoryRep } from '../entities/history-rep.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DebtRequest, Student, HistoryRep]),
  ],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}