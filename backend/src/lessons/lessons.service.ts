import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from '../entities/lesson.entity';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
  ) {}

  // СОЗДАНИЕ НОВОГО ПРЕДМЕТА
  async create(createLessonDto: CreateLessonDto) {
    if (createLessonDto.name.trim() === "") {
      throw new InternalServerErrorException('Пустое поле предмета!');
    }

    const lesson = this.lessonsRepository.create(createLessonDto);
    return await this.lessonsRepository.save(lesson);
  }

  // ВЫДАЧА ВСЕХ ПРЕДМЕТОВ
  async getLessons() {
    return await this.lessonsRepository.find();
  }

  // ОБНОВЛЕНИЕ ПРЕДМЕТА
  async update(id: number, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    
    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }

    if (updateLessonDto.name.trim() === "") {
      throw new NotFoundException('Название предмета не может быть пустым');
    }

    lesson.name = updateLessonDto.name;
    return await this.lessonsRepository.save(lesson);
  }

  // УДАЛЕНИЕ ПРЕДМЕТА
  async remove(id: number) {
    const lesson = await this.lessonsRepository.findOne({ where: { id } });
    
    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }

    return await this.lessonsRepository.remove(lesson);
  }
}