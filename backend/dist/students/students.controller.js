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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const students_service_1 = require("./students.service");
const create_student_dto_1 = require("./dto/create-student.dto");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
let StudentsController = class StudentsController {
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    create(createStudentDto) {
        return this.studentsService.create(createStudentDto);
    }
    findAll() {
        return this.studentsService.findAll();
    }
    getReputationHistory(id) {
        return this.studentsService.getReputationHistory(+id);
    }
    updateReputation(id, change, reason) {
        return this.studentsService.updateReputation(+id, change, reason);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Создание студента' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Студент успешно создан' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Требуется авторизация' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Получение всех студентов' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список студентов' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Требуется авторизация' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Получение истории репутации студента' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'История репутации' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Требуется авторизация' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Студент не найден' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "getReputationHistory", null);
__decorate([
    (0, common_1.Patch)(':id/reputation'),
    (0, swagger_1.ApiOperation)({ summary: 'Изменение репутации студента' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Репутация успешно изменена' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Требуется авторизация' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Студент не найден' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('change')),
    __param(2, (0, common_1.Body)('reason')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "updateReputation", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('Студенты'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map