import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { User } from '../entities/user.entity';
import { Student } from '../entities/student.entity';
import { Group } from '../entities/group.entity';
import { Lesson } from 'src/entities/lesson.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Student, Group, Lesson]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}