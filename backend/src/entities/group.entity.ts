import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Student } from './student.entity';

@Entity('groups')
@Unique(['name'])
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Student, student => student.groups)
  students: Student[];
}