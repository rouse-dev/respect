import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async createGroup(dto: CreateGroupDto) {
    return this.prisma.groups.create({
      data: {
        name: dto.name,
      },
    });
  }

  async getAllGroups() {
    return this.prisma.groups.findMany({
      include: {
        students: true,
      },
    });
  }

  async getGroupById(id: number) {
    return this.prisma.groups.findUnique({
      where: { id },
      include: {
        students: true,
      },
    });
  }

  async updateGroup(id: number, dto: UpdateGroupDto) {
    return this.prisma.groups.update({
      where: { id },
      data: {
        name: dto.name,
      },
    });
  }

  async deleteGroup(id: number) {
    return this.prisma.groups.delete({
      where: { id },
    });
  }
}