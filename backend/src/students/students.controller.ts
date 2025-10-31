import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StudentsService } from './students.service';
import { CreateDebtRequestDto } from './dto/create-debt-request.dto';

@ApiTags('Студенты')
@ApiBearerAuth()
@Controller('students')
@UseGuards(AuthGuard('jwt'))
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('debt-requests')
  @ApiOperation({ summary: 'Отправить заявку на списание долга' })
  @ApiBody({ type: CreateDebtRequestDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Заявка на списание успешно отправлена' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Неверные данные запроса' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Предмет не найден' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав' 
  })
  async createDebtRequest(
    @Request() req,
    @Body() createDebtRequestDto: CreateDebtRequestDto,
  ) {
    const studentId = req.user.id;
    return this.studentsService.createDebtRequest(
      studentId,
      createDebtRequestDto,
    );
  }

  @Get('debt-requests')
  @ApiOperation({ summary: 'Получить историю своих заявок на списание' })
  @ApiResponse({ 
    status: 200, 
    description: 'История заявок успешно получена' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав' 
  })
  async getDebtRequestsHistory(@Request() req) {
    const studentId = req.user.id;
    return this.studentsService.getDebtRequestsHistory(studentId);
  }

  @Get('debt-requests/:id')
  @ApiOperation({ summary: 'Получить детальную информацию о заявке по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID заявки' })
  @ApiResponse({ 
    status: 200, 
    description: 'Информация о заявке успешно получена' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Заявка не найдена' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Недостаточно прав для просмотра этой заявки' 
  })
  async getDebtRequestById(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const studentId = req.user.id;
    return this.studentsService.getDebtRequestById(studentId, id);
  }
}