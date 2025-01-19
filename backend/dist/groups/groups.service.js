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
exports.GroupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let GroupsService = class GroupsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createGroup(dto) {
        return this.prisma.groups.create({
            data: {
                name: dto.name,
            },
        });
    }
    async getAllGroups() {
        return this.prisma.groups.findMany({
            include: {
                students: true,
            },
        });
    }
    async getGroupById(id) {
        return this.prisma.groups.findUnique({
            where: { id },
            include: {
                students: true,
            },
        });
    }
    async updateGroup(id, dto) {
        return this.prisma.groups.update({
            where: { id },
            data: {
                name: dto.name,
            },
        });
    }
    async deleteGroup(id) {
        return this.prisma.groups.delete({
            where: { id },
        });
    }
};
exports.GroupsService = GroupsService;
exports.GroupsService = GroupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GroupsService);
//# sourceMappingURL=groups.service.js.map