import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    create(createStudentDto: CreateStudentDto): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        groupsId: number;
        reputation: number;
    }>;
    findAll(): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        groupsId: number;
        reputation: number;
    }[]>;
    getReputationHistory(id: string): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        groupsId: number;
        reputation: number;
    }[] | {
        id: number;
        createdAt: Date;
        studentId: number;
        change: number;
        reason: string | null;
    }[]>;
    updateReputation(id: string, change: number, reason?: string): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        groupsId: number;
        reputation: number;
    }>;
}
