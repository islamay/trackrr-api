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
exports.validateCreateAttendance = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const response_1 = __importDefault(require("../../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../../middlewares/auth/companyMemberAuth"));
const workshiftAuth_1 = __importDefault(require("../../../../middlewares/auth/workshiftAuth"));
const verifyToken_1 = __importDefault(require("../../../../middlewares/verifyToken"));
const validatePayload_1 = __importDefault(require("../../../../middlewares/validatePayload"));
const ConflictError_1 = __importDefault(require("../../../../errors/ConflictError"));
const ForbiddenError_1 = __importDefault(require("../../../../errors/ForbiddenError"));
exports.validateCreateAttendance = [
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId'),
    (0, workshiftAuth_1.default)(),
    (0, express_validator_1.body)('workshiftMemberId').notEmpty().isUUID().bail().custom((i, { req }) => {
        const { workshiftMemberId, workshiftMember } = req.body;
        if (workshiftMemberId !== workshiftMember.id) {
            req.body.error = new ForbiddenError_1.default('Forbidden');
            return false;
        }
        else {
            return true;
        }
    }),
    (0, validatePayload_1.default)(),
];
const createAttendance = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { workshiftMemberId, workshiftMember } = req.body;
        const date = new Date();
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const isTodayAttendanceCreated = yield prisma_1.default.attendance.findFirst({
            where: {
                workshiftId: workshiftMember.workshiftId,
                workshiftMemberId: workshiftMemberId,
                checkedInTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });
        if (isTodayAttendanceCreated)
            throw new ConflictError_1.default('Your attendance for today already exist');
        const attendance = yield prisma_1.default.attendance.create({
            data: {
                workshiftId: workshiftMember.workshiftId,
                workshiftMemberId: workshiftMemberId,
                status: 'ONGOING',
            }
        });
        res.status(201).json((0, response_1.default)('success', { attendance }));
    });
};
exports.default = createAttendance;
