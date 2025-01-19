"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeachersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let TeachersService = class TeachersService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(email, password, name) {
        try {
            const existingTeacher = await this.prisma.teacher.findUnique({
                where: { email },
            });
            if (existingTeacher) {
                throw new common_1.ConflictException('Учитель с таким email уже существует');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const teacher = await this.prisma.teacher.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                },
            });
            return { id: teacher.id, email: teacher.email, name: teacher.name };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async login(email, password) {
        try {
            const teacher = await this.prisma.teacher.findUnique({
                where: { email },
            });
            if (!teacher) {
                throw new common_1.UnauthorizedException('Неверный email или пароль');
            }
            const isPasswordValid = await bcrypt.compare(password, teacher.password);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Неверный email или пароль');
            }
            const payload = { email: teacher.email, sub: teacher.id };
            const accessToken = this.jwtService.sign(payload, {
                secret: this.configService.get('JWT_SECRET'),
                expiresIn: this.configService.get('JWT_EXPIRES_IN'),
            });
            return { accessToken };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
};
exports.TeachersService = TeachersService;
exports.TeachersService = TeachersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], TeachersService);
//# sourceMappingURL=teachers.service.js.map