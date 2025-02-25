import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ НОВОГО ПРЕДМЕТА
  async create(createLessonDto: CreateLessonDto) {
    if(createLessonDto.name.trim() === "") {
      throw new InternalServerErrorException('Пустое поле предмета!');
    }
    return this.prisma.lessons.create({
      data: createLessonDto,
    });
  }

  // ВЫДАЧА ВСЕХ ПРЕДМЕТОВ
  async getLessons() {
    return this.prisma.lessons.findMany()
  }

  // ОБНОВЛЕНИЕ ПРЕДМЕТА
  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.prisma.lessons.findUnique({ where: { id } });
    if (!lesson || updateLessonDto.name.trim() === "") {
      throw new NotFoundException(`Lesson with ID ${id} or lesson name not found`);
    }
    return this.prisma.lessons.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  // УДАЛЕНИЕ ПРЕДМЕТА
  async remove(id: number) {
    const lesson = await this.prisma.lessons.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return this.prisma.lessons.delete({ where: { id } });
  }
}