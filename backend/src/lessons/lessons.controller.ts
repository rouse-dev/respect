import { Controller, Post, Body, Delete, Param, NotFoundException, Patch, UseGuards, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Предметы')
@ApiBearerAuth()
@Controller('lessons')
@UseGuards(AuthGuard('jwt')) // JWT ЗАЩИТА ДЛЯ ВСЕХ РОУТОВ СТУДЕНТОВ
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать новый учебный предмет' })
  @ApiResponse({ status: 201, description: 'Предмет успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async create(@Body() createLessonDto: CreateLessonDto) {
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Выдача всех учебных предметов' })
  @ApiResponse({ status: 201, description: 'Предметы успешно выданы' })
  @ApiResponse({ status: 400, description: 'Ошибка при выдаче предметов' })
  async get() {
    return this.lessonsService.getLessons();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить учебный предмет по ID' })
  @ApiResponse({ status: 200, description: 'Предмет успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const lesson = await this.lessonsService.update(+id, updateLessonDto);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить учебный предмет по ID' })
  @ApiResponse({ status: 200, description: 'Предмет успешно удален' })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  async remove(@Param('id') id: string) {
    const lesson = await this.lessonsService.remove(+id);
    if (!lesson) {
      throw new NotFoundException(`Lesson with ID ${id} not found`);
    }
    return lesson;
  }
}