export interface DebtRequest {
  id: number;
  studentId: number;
  teacherId: number;
  lessonId: number;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  description: string;
  teacherComment: string | null;
  createdAt: string;
  student: {
    id: number;
    name: string;
    email: string;
    avatar: string;
    reputation: number;
    groupsId: number;
    createdAt: string;
    groups: {
      id: number;
      name: string;
    };
  };
  lesson: {
    id: number;
    name: string;
    teacher_id: number;
  };
}