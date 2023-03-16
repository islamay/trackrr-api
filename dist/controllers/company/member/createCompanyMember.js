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
exports.validateCreateCompanyMember = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const ConflictError_1 = __importDefault(require("../../../errors/ConflictError"));
const ForbiddenError_1 = __importDefault(require("../../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../lib/response"));
const userAuth_1 = __importDefault(require("../../../middlewares/auth/userAuth"));
const validatePayload_1 = __importDefault(require("../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../middlewares/verifyToken"));
exports.validateCreateCompanyMember = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)('ADMIN'),
    (0, express_validator_1.param)('companyId').notEmpty(),
    (0, express_validator_1.body)('userId').notEmpty().isUUID().bail(),
    (0, express_validator_1.body)('role').optional().isIn(Object.values(client_1.MemberRole)),
    (0, validatePayload_1.default)(),
];
const createCompanyMember = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.body.session.user.role !== client_1.UserRole.ADMIN)
            throw new ForbiddenError_1.default('Forbidden');
        const userExist = yield prisma_1.default.user.findMany({ where: { id: { equals: req.body.userId } } });
        const userIsCompanyMember = yield prisma_1.default.companyMember.count({
            where: {
                companyId: req.params.companyId,
                userId: req.body.userId
            }
        });
        if (!userExist)
            throw new NoContentError_1.default('User not found');
        if (userIsCompanyMember)
            throw new ConflictError_1.default('User already member');
        const member = yield prisma_1.default.companyMember.create({
            data: {
                companyId: req.params.companyId,
                userId: req.body.userId,
                role: req.body.role || client_1.MemberRole.MEMBER
            }
        });
        res.status(201).json((0, response_1.default)('success', { member }));
    });
};
exports.default = createCompanyMember;
