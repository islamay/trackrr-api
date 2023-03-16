"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePatchAttendance = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../../middlewares/auth/companyMemberAuth"));
const workshiftAuth_1 = __importDefault(require("../../../../middlewares/auth/workshiftAuth"));
const validatePayload_1 = __importDefault(require("../../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../../middlewares/verifyToken"));
exports.validatePatchAttendance = [
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId'),
    (0, workshiftAuth_1.default)(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const attendance = yield prisma_1.default.attendance.findUnique({
            where: { id: req.params.attendanceId }
        });
        if (!attendance)
            throw new NoContentError_1.default('Attendance not found');
        if (attendance.status === 'DONE')
            throw new ForbiddenError_1.default('Forbidden');
        if (req.body.workshiftMember.id !== attendance.workshiftMemberId)
            throw new ForbiddenError_1.default('Forbidden');
        req.body.attendance = attendance;
        return next();
    }),
    (0, express_validator_1.body)('status').optional().equals(client_1.AttendanceStatus.DONE),
    (0, validatePayload_1.default)(),
];
const patchAttendance = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const updated = yield prisma_1.default.attendance.update({
            where: { id: req.body.attendance.id },
            data: { status: req.body.status }
        });
        return res.json((0, response_1.default)('success', { attendance: updated }));
    });
};
exports.default = patchAttendance;
