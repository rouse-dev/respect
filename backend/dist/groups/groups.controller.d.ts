import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
export declare class GroupsController {
    private readonly groupsService;
    constructor(groupsService: GroupsService);
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
    getGroupById(id: string): Promise<{
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
    updateGroup(id: string, dto: UpdateGroupDto): Promise<{
        id: number;
        name: string;
    }>;
    deleteGroup(id: string): Promise<{
        id: number;
        name: string;
    }>;
}
