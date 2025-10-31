import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  NotFoundException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AdminOnly } from '../auth/decorators/admin.decorator';
import {
  CreateStudentDto,
  CreateManyStudentsDto,
} from './dto/create-student.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@ApiTags('Администраторы')
@ApiBearerAuth()
@Controller('admin')
@AdminOnly() // ВСЕ РОУТЫ ТОЛЬКО ДЛЯ АДМИНОВ
export class AdminController {
  constructor(
    private readonly adminService: AdminService
  ) {}

  // ========== ПОЛЬЗОВАТЕЛИ ==========

  @Post('users')
  @ApiOperation({
    summary: 'Регистрация нового пользователя (только для админов)',
  })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
  })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async registerUser(@Request() req, @Body() registerUserDto: RegisterUserDto) {
    const adminId = req.user.id;
    return this.adminService.registerUser(adminId, registerUserDto);
  }

  @Get('users')
  @ApiOperation({
    summary: 'Получение всех пользователей (только для админов)',
  })
  @ApiResponse({ status: 200, description: 'Список пользователей получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getAllUsers(@Request() req) {
    const adminId = req.user.id;
    return this.adminService.getAllUsers(adminId);
  }

  @Get('users/:id')
  @ApiOperation({
    summary: 'Получение пользователя по ID (только для админов)',
  })
  @ApiResponse({ status: 200, description: 'Пользователь получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getUserById(@Param('id') id: string, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.getUserById(adminId, +id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Обновление пользователя (только для админов)' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async updateUser(
    @Param('id') id: string,
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const adminId = req.user.id;
    return this.adminService.updateUser(adminId, +id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Удаление пользователя (только для админов)' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async deleteUser(@Param('id') id: string, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.deleteUser(adminId, +id);
  }

  // ========== СТУДЕНТЫ ==========

  @Post('students')
  @ApiOperation({
    summary: 'Создание студента с автогенерацией данных (только для админов)',
  })
  @ApiResponse({ status: 201, description: 'Студент успешно создан' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Группа не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async createStudent(
    @Request() req,
    @Body() createStudentDto: CreateStudentDto,
  ) {
    const adminId = req.user.id;
    return this.adminService.createStudent(adminId, createStudentDto);
  }

  @Post('students/many')
  @ApiOperation({
    summary: 'Создание множества студентов (только для админов)',
  })
  @ApiResponse({ status: 201, description: 'Студенты успешно созданы' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async createManyStudents(
    @Request() req,
    @Body() createManyStudentsDto: CreateManyStudentsDto,
  ) {
    const adminId = req.user.id;
    return this.adminService.createManyStudents(adminId, createManyStudentsDto);
  }

  @Get('students')
  @ApiOperation({ summary: 'Получение всех студентов (только для админов)' })
  @ApiResponse({ status: 200, description: 'Список студентов получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getAllStudents(@Request() req) {
    const adminId = req.user.id;
    return this.adminService.getAllStudents(adminId);
  }

  @Get('students/:id')
  @ApiOperation({ summary: 'Получение студента по ID (только для админов)' })
  @ApiResponse({ status: 200, description: 'Студент получен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getStudentById(@Param('id') id: string, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.getStudentById(adminId, +id);
  }

  @Patch('students/:id')
  @ApiOperation({ summary: 'Обновление студента (только для админов)' })
  @ApiResponse({ status: 200, description: 'Студент успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async updateStudent(
    @Param('id') id: string,
    @Request() req,
    @Body() updateStudentDto: UpdateUserDto,
  ) {
    const adminId = req.user.id;
    return this.adminService.updateStudent(adminId, +id, updateStudentDto);
  }

  @Delete('students/:id')
  @ApiOperation({ summary: 'Удаление студента (только для админов)' })
  @ApiResponse({ status: 200, description: 'Студент успешно удален' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async deleteStudent(@Param('id') id: string, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.deleteStudent(adminId, +id);
  }

  @Get('students/:id/credentials')
  @ApiOperation({
    summary: 'Получение данных для входа студента (только для админов)',
  })
  @ApiResponse({ status: 200, description: 'Данные для входа получены' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Студент не найден' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async getStudentCredentials(@Param('id') id: string, @Request() req) {
    const adminId = req.user.id;
    return this.adminService.getStudentCredentials(adminId, +id);
  }

  // ========== ГРУППЫ ==========

  @Post('groups')
  @ApiOperation({ summary: 'Создание группы (только для админов)' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'Группа успешно создана.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  createGroup(@Request() req, @Body() dto: CreateGroupDto) {
    const adminId = req.user.id;
    // Можно добавить логику проверки прав админа если нужно
    return this.adminService.createGroup(dto);
  }

  @Get('groups')
  @ApiOperation({ summary: 'Получение всех групп (только для админов)' })
  @ApiResponse({ status: 200, description: 'Список групп успешно получен.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  getAllGroups(@Request() req) {
    const adminId = req.user.id;
    return this.adminService.getAllGroups();
  }

  @Get('groups/:id')
  @ApiOperation({ summary: 'Получение группы по ID (только для админов)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Айди группы' })
  @ApiResponse({ status: 200, description: 'Информация о группе успешно получена.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  getGroupById(@Request() req, @Param('id') id: string) {
    const adminId = req.user.id;
    return this.adminService.getGroupById(+id);
  }

  @Patch('groups/:id')
  @ApiBody({ type: UpdateGroupDto })
  @ApiOperation({ summary: 'Обновление группы (только для админов)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор группы' })
  @ApiResponse({ status: 200, description: 'Информация о группе успешно обновлена.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  updateGroup(@Request() req, @Param('id') id: string, @Body() dto: UpdateGroupDto) {
    const adminId = req.user.id;
    return this.adminService.updateGroup(+id, dto);
  }

  @Delete('groups/:id')
  @ApiOperation({ summary: 'Удаление группы (только для админов)' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор группы' })
  @ApiResponse({ status: 200, description: 'Группа успешно удалена.' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  deleteGroup(@Request() req, @Param('id') id: string) {
    const adminId = req.user.id;
    return this.adminService.deleteGroup(+id);
  }

  // ========== ПРЕДМЕТЫ ==========

  @Post('lessons')
  @ApiOperation({ summary: 'Создать новый учебный предмет (только для админов)' })
  @ApiResponse({ status: 201, description: 'Предмет успешно создан' })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async createLesson(@Request() req, @Body() createLessonDto: CreateLessonDto) {
    const adminId = req.user.id;
    return this.adminService.createLesson(createLessonDto);
  }

  @Get('lessons')
  @ApiOperation({ summary: 'Выдача всех учебных предметов (только для админов)' })
  @ApiResponse({ status: 201, description: 'Предметы успешно выданы' })
  @ApiResponse({ status: 400, description: 'Ошибка при выдаче предметов' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  async getLessons(@Request() req) {
    const adminId = req.user.id;
    return this.adminService.getLessons();
  }

  @Patch('lessons/:id')
  @ApiOperation({ summary: 'Обновить учебный предмет по ID (только для админов)' })
  @ApiResponse({ status: 200, description: 'Предмет успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  async updateLesson(
    @Request() req,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    const adminId = req.user.id;
    const lesson = await this.adminService.updateLesson(+id, updateLessonDto);
    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }
    return lesson;
  }

  @Delete('lessons/:id')
  @ApiOperation({ summary: 'Удалить учебный предмет по ID (только для админов)' })
  @ApiResponse({ status: 200, description: 'Предмет успешно удален' })
  @ApiResponse({ status: 403, description: 'Недостаточно прав' })
  @ApiResponse({ status: 404, description: 'Предмет не найден' })
  async removeLesson(@Request() req, @Param('id') id: string) {
    const adminId = req.user.id;
    const lesson = await this.adminService.removeLesson(+id);
    if (!lesson) {
      throw new NotFoundException(`Предмет с ID ${id} не найден`);
    }
    return lesson;
  }
}