import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // СОЗДАНИЕ ГРУППЫ
  async createGroup(dto: CreateGroupDto) {
    try {
      return this.prisma.groups.create({
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫДАТЬ ВСЕ ГРУППЫ
  async getAllGroups() {
    try {
      return this.prisma.groups.findMany({
        include: {
          students: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // НАЙТИ ГРУППУ ПО АЙДИ
  async getGroupById(id: number) {
    try {
      return this.prisma.groups.findUnique({
        where: { id },
        include: {
          students: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОБНОВИТЬ ГРУППУ ПО АЙДИ
  async updateGroup(id: number, dto: UpdateGroupDto) {
    try {
      if(dto.name.trim() === "") {
        throw new NotFoundException("Поле пустое")
      }
      return this.prisma.groups.update({
        where: { id },
        data: {
          name: dto.name,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УДАЛИТЬ ГРУППУ ПО АЙДИ
  async deleteGroup(id: number) {
    try {
      return this.prisma.groups.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
