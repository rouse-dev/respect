import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Lesson } from './lesson.entity';

@Entity('history_reps')
export class HistoryRep {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @Column()
  change: number;

  @Column({ nullable: true })
  reason: string;

  @Column({ nullable: true })
  lessonId: number;

  @Column({ nullable: true })
  class: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Student, student => student.historyReps)
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @ManyToOne(() => Lesson, lesson => lesson.historyReps)
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;
}