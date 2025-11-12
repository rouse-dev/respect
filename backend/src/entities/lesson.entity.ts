import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { HistoryRep } from './history-rep.entity';
import { User } from './user.entity';
import { DebtRequest } from './debt-request.entity';

@Entity('lessons')
@Unique(['name'])
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

  @OneToMany(() => DebtRequest, debtRequest => debtRequest.lesson)
  debtRequests: DebtRequest[];

  @Column({ nullable: true })
  teacher_id: number;
}