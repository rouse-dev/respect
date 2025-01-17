import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Учителя')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // РЕГИСТРАЦИЯ УЧИТЕЛЯ
  @Post('register')
  @ApiOperation({ summary: 'Регистрация учителя' })
  @ApiBody({ type: RegisterTeacherDto })
  @ApiResponse({ status: 201, description: 'Учитель успешно зарегистрирован' })
  @ApiResponse({ status: 409, description: 'Учитель с таким email уже существует' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async register(@Body() registerTeacherDto: RegisterTeacherDto) {
    return this.teachersService.register(
      registerTeacherDto.email,
      registerTeacherDto.password,
      registerTeacherDto.name,
    );
  }

  // ЛОГИРОВАНИЕ УЧИТЕЛЯ
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Логирование учителя' })
  @ApiBody({ type: LoginTeacherDto })
  @ApiResponse({ status: 200, description: 'Успешный вход, возвращает JWT-токен' })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера' })
  async login(@Body() loginTeacherDto: LoginTeacherDto) {
    return this.teachersService.login(loginTeacherDto.email, loginTeacherDto.password);
  }
}