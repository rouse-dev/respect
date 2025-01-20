import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Группы')
@ApiBearerAuth()

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание группы' })
  @ApiBody({ type: CreateGroupDto })
  @ApiResponse({ status: 201, description: 'Группа успешно создана.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение групп' })
  @ApiResponse({ status: 200, description: 'Список групп успешно получен.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение групп по Id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Айди группы' })
  @ApiResponse({ status: 200, description: 'Информация о группе успешно получена.' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  getGroupById(@Param('id') id: string) {
    return this.groupsService.getGroupById(+id);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateGroupDto })
  @ApiOperation({ summary: 'Обновление группы' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор группы' })
  @ApiResponse({ status: 200, description: 'Информация о группе успешно обновлена.' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.updateGroup(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление группы' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор группы' })
  @ApiResponse({ status: 200, description: 'Группа успешно удалена.' })
  @ApiResponse({ status: 404, description: 'Группа не найдена.' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка сервера.' })
  deleteGroup(@Param('id') id: string) {
    return this.groupsService.deleteGroup(+id);
  }
}
