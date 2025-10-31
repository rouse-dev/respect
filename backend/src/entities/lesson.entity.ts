import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { HistoryRep } from './history-rep.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => HistoryRep, historyRep => historyRep.lesson)
  historyReps: HistoryRep[];
}