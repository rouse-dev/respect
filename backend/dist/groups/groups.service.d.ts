import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsService {
    private prisma;
    constructor(prisma: PrismaService);
    createGroup(dto: CreateGroupDto): Promise<{
        id: number;
        name: string;
    }>;
    getAllGroups(): Promise<({
        students: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            groupsId: number;
            reputation: number;
        }[];
    } & {
        id: number;
        name: string;
    })[]>;
    getGroupById(id: number): Promise<{
        students: {
            id: number;
            email: string;
            name: string;
            createdAt: Date;
            groupsId: number;
            reputation: number;
        }[];
    } & {
        id: number;
        name: string;
    }>;
    updateGroup(id: number, dto: UpdateGroupDto): Promise<{
        id: number;
        name: string;
    }>;
    deleteGroup(id: number): Promise<{
        id: number;
        name: string;
    }>;
}
