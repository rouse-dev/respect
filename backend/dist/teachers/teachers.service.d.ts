import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class TeachersService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(email: string, password: string, name?: string): Promise<{
        id: number;
        email: string;
        name: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
    }>;
}
