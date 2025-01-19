import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: {
        email: string;
    }): Promise<{
        id: number;
        email: string;
        password: string;
        name: string | null;
        createdAt: Date;
    }>;
}
export {};
