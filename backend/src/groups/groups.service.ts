import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private groupsRepository: Repository<Group>,
  ) {}

  // СОЗДАНИЕ ГРУППЫ
  async createGroup(dto: CreateGroupDto) {
    try {
      const group = this.groupsRepository.create({
        name: dto.name,
      });

      return await this.groupsRepository.save(group);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ВЫДАТЬ ВСЕ ГРУППЫ
  async getAllGroups() {
    try {
      return await this.groupsRepository.find({
        relations: ['students'],
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // НАЙТИ ГРУППУ ПО АЙДИ
  async getGroupById(id: number) {
    try {
      const group = await this.groupsRepository.findOne({
        where: { id },
        relations: ['students'],
      });

      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      return group;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // ОБНОВИТЬ ГРУППУ ПО АЙДИ
  async updateGroup(id: number, dto: UpdateGroupDto) {
    try {
      if (dto.name.trim() === "") {
        throw new NotFoundException("Поле пустое");
      }

      const group = await this.groupsRepository.findOne({ where: { id } });
      
      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      group.name = dto.name;
      return await this.groupsRepository.save(group);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // УДАЛИТЬ ГРУППУ ПО АЙДИ
  async deleteGroup(id: number) {
    try {
      const group = await this.groupsRepository.findOne({ where: { id } });
      
      if (!group) {
        throw new NotFoundException('Группа не найдена');
      }

      return await this.groupsRepository.remove(group);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}