import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { User } from './user.entity';
import { Lesson } from './lesson.entity';

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

@Entity('debt_requests')
export class DebtRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  teacherId: number;

  @Column()
  lessonId: number;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING
  })
  status: RequestStatus;

  @Column()
  points: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  teacherComment: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Student, student => student.debtRequests)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => User, user => user.debtRequests)
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  // Add the @ManyToOne decorator here
  @ManyToOne(() => Lesson, lesson => lesson.debtRequests)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;
}