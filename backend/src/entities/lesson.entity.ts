import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { HistoryRep } from './history-rep.entity';
import { User } from './user.entity';

@Entity('lessons')
export class Lesson {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => HistoryRep, historyRep => historyRep.lesson)
  historyReps: HistoryRep[];

  // Необязательная связь с учителем
  @ManyToOne(() => User, user => user.lessons, { nullable: true })
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ nullable: true })
  teacher_id: number;
}