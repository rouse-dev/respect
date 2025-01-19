import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
export declare class StudentsService {
    private prisma;
    constructor(prisma: PrismaService);
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
    getReputationHistory(studentId: number): Promise<{
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
    updateReputation(studentId: number, change: number, reason?: string): Promise<{
        id: number;
        email: string;
        name: string;
        createdAt: Date;
        groupsId: number;
        reputation: number;
    }>;
}
