import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Группы')
@ApiBearerAuth()

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание группы' })
  createGroup(@Body() dto: CreateGroupDto) {
    return this.groupsService.createGroup(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Получение групп' })
  getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение групп по Id' })
  getGroupById(@Param('id') id: string) {
    return this.groupsService.getGroupById(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление группы' })
  updateGroup(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return this.groupsService.updateGroup(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление группы' })
  deleteGroup(@Param('id') id: string) {
    return this.groupsService.deleteGroup(+id);
  }
}
