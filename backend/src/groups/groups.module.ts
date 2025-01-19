import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [GroupsController],
  providers: [PrismaService, GroupsService],
})
export class GroupsModule {}