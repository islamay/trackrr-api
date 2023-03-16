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
exports.validateGetAttendances = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../../middlewares/auth/companyMemberAuth"));
const validatePayload_1 = __importDefault(require("../../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../../middlewares/verifyToken"));
exports.validateGetAttendances = [
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId'),
    (0, express_validator_1.param)('workshiftMemberId').optional().isUUID(),
    (0, validatePayload_1.default)(),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { membership, session } = req.body;
        const { workshiftMemberId } = req.query;
        if (session.user.role === 'ADMIN')
            return next();
        if (membership.role === 'OWNER' || membership.role === 'OPERATOR')
            return next();
        if (!workshiftMemberId)
            throw new ForbiddenError_1.default('Forbidden');
        if (workshiftMemberId) {
            const workshiftMember = yield prisma_1.default.workshiftMember.findUnique({
                where: { id: workshiftMemberId },
            });
            if (!workshiftMember)
                throw new NoContentError_1.default('Workshift member not found');
            if (workshiftMember.companyMemberId !== membership.id)
                throw new ForbiddenError_1.default('Forbidden');
            return next();
        }
    })
];
const getAttendances = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const attendance = yield prisma_1.default.attendance.findMany({
            where: {
                workshiftId: req.params.workshiftId,
                workshiftMemberId: req.query.workshiftMemberId
            }
        });
        res.json((0, response_1.default)('success', { attendance }));
    });
};
exports.default = getAttendances;
