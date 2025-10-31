import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { HistoryRep } from './history-rep.entity';
import { DebtRequest } from './debt-request.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'uploads/avatars/default.jpg' })
  avatar: string;

  @Column({ default: 0 })
  reputation: number;

  @Column()
  groupsId: number;

  @ManyToOne(() => Group, group => group.students)
  @JoinColumn({ name: 'groupsId' })
  groups: Group;

  @OneToMany(() => HistoryRep, historyRep => historyRep.student)
  historyReps: HistoryRep[];

  @OneToMany(() => DebtRequest, debtRequest => debtRequest.student)
  debtRequests: DebtRequest[];

  @CreateDateColumn()
  createdAt: Date;
}