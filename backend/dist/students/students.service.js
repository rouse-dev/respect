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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StudentsService = class StudentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        return this.prisma.student.create({
            data: {
                name: createStudentDto.name,
                email: createStudentDto.email,
                groups: {
                    connect: { id: createStudentDto.groupsId },
                },
            },
        });
    }
    async findAll() {
        try {
            return this.prisma.student.findMany();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
    async getReputationHistory(studentId) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
                include: { historyReps: true },
            });
            if (!student) {
                throw new common_1.NotFoundException('Студент не найден');
            }
            return student.historyReps;
        }
        catch (error) {
            return this.prisma.student.findMany();
        }
    }
    async updateReputation(studentId, change, reason) {
        try {
            const student = await this.prisma.student.findUnique({
                where: { id: studentId },
            });
            if (!student) {
                throw new common_1.NotFoundException('Студент не найден');
            }
            const updatedStudent = await this.prisma.student.update({
                where: { id: studentId },
                data: {
                    reputation: {
                        increment: change,
                    },
                },
            });
            await this.prisma.historyRep.create({
                data: {
                    studentId,
                    change,
                    reason,
                },
            });
            return updatedStudent;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map