import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { TeachersModule } from './teachers/teachers.module';
import { ConfigModule } from '@nestjs/config';
import { StudentsModule } from './students/students.module';
import { GroupsModule } from './groups/groups.module';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './.env'),
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TeachersModule,
    StudentsModule,
    GroupsModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
