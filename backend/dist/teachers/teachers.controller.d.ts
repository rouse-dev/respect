import { TeachersService } from './teachers.service';
import { RegisterTeacherDto } from './dto/register-teacher.dto';
import { LoginTeacherDto } from './dto/login-teacher.dto';
export declare class TeachersController {
    private readonly teachersService;
    constructor(teachersService: TeachersService);
    register(registerTeacherDto: RegisterTeacherDto): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
    login(loginTeacherDto: LoginTeacherDto): Promise<{
        accessToken: string;
    }>;
}
