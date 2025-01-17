import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TeachersModule } from './teachers/teachers.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: path.resolve(__dirname, '../../.env') }),
    TeachersModule,
    StudentsModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
