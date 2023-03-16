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
exports.validateDeleteMember = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../middlewares/auth/companyMemberAuth"));
const verifyToken_1 = __importDefault(require("../../../middlewares/verifyToken"));
exports.validateDeleteMember = [
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId', ['OWNER', 'OPERATOR'])
];
const deleteMember = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const member = yield prisma_1.default.companyMember.findUnique({
            where: { id: req.params.memberId },
            include: { workshifts: true }
        });
        if (!member)
            throw new NoContentError_1.default('Member not found');
        if (member.role === 'OWNER' && req.body.session.user.role !== 'ADMIN')
            throw new ForbiddenError_1.default('Forbidden');
        yield prisma_1.default.companyMember.delete({ where: { id: req.params.memberId } });
        res.json((0, response_1.default)('success', { member }));
    });
};
exports.default = deleteMember;
