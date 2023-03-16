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
exports.validateCreateWorkshiftMember = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const NoContentError_1 = __importDefault(require("../../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../../middlewares/auth/companyMemberAuth"));
const validatePayload_1 = __importDefault(require("../../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../../middlewares/verifyToken"));
exports.validateCreateWorkshiftMember = [
    (0, express_validator_1.param)('companyId').isUUID(),
    (0, validatePayload_1.default)(),
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId', ['OWNER', 'OPERATOR']),
    (0, express_validator_1.param)('workshiftId').isUUID(),
    (0, express_validator_1.body)('companyMemberId').isUUID(),
    (0, validatePayload_1.default)(),
];
const createWorkshiftMember = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const workshift = yield prisma_1.default.workshift.findUnique({ where: { id: req.params.workshiftId } });
        const companyMember = yield prisma_1.default.companyMember.findUnique({ where: { id: req.body.companyMemberId } });
        if (!workshift)
            throw new NoContentError_1.default('Workshift not found');
        if (!companyMember)
            throw new NoContentError_1.default('Company member not found');
        const workshiftMember = yield prisma_1.default.workshiftMember.create({
            data: {
                workshiftId: req.params.workshiftId,
                companyMemberId: req.body.companyMemberId,
            }
        });
        res.status(201).json((0, response_1.default)('success', { workshiftMember }));
    });
};
exports.default = createWorkshiftMember;
