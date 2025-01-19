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
exports.TeachersController = void 0;
const common_1 = require("@nestjs/common");
const teachers_service_1 = require("./teachers.service");
const register_teacher_dto_1 = require("./dto/register-teacher.dto");
const login_teacher_dto_1 = require("./dto/login-teacher.dto");
const swagger_1 = require("@nestjs/swagger");
let TeachersController = class TeachersController {
    constructor(teachersService) {
        this.teachersService = teachersService;
    }
    async register(registerTeacherDto) {
        return this.teachersService.register(registerTeacherDto.email, registerTeacherDto.password, registerTeacherDto.name);
    }
    async login(loginTeacherDto) {
        return this.teachersService.login(loginTeacherDto.email, loginTeacherDto.password);
    }
};
exports.TeachersController = TeachersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Регистрация учителя' }),
    (0, swagger_1.ApiBody)({ type: register_teacher_dto_1.RegisterTeacherDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Учитель успешно зарегистрирован' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Учитель с таким email уже существует' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_teacher_dto_1.RegisterTeacherDto]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Логирование учителя' }),
    (0, swagger_1.ApiBody)({ type: login_teacher_dto_1.LoginTeacherDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Успешный вход, возвращает JWT-токен' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Неверный email или пароль' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Внутренняя ошибка сервера' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_teacher_dto_1.LoginTeacherDto]),
    __metadata("design:returntype", Promise)
], TeachersController.prototype, "login", null);
exports.TeachersController = TeachersController = __decorate([
    (0, swagger_1.ApiTags)('Учителя'),
    (0, common_1.Controller)('teachers'),
    __metadata("design:paramtypes", [teachers_service_1.TeachersService])
], TeachersController);
//# sourceMappingURL=teachers.controller.js.map