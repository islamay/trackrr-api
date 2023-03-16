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
exports.validateGetInvitations = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const AuthorizationError_1 = __importDefault(require("../../errors/AuthorizationError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const response_1 = __importDefault(require("../../lib/response"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateGetInvitations = [(0, verifyToken_1.default)()];
const checkUserRole = (companyId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const member = yield prisma_1.default.companyMember.findFirst({
        where: { companyId, userId }
    });
    if (!member)
        throw new ForbiddenError_1.default('Forbidden');
    if (member.role === 'MEMBER')
        throw new ForbiddenError_1.default('Forbidden');
    return;
});
const checkUserId = (inputUserId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (userId !== inputUserId)
        throw new ForbiddenError_1.default('Forbidden');
    return;
});
const checkAdmin = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user)
        throw new AuthorizationError_1.default('Unauthorized');
    if (user.role !== 'ADMIN')
        throw new ForbiddenError_1.default('Forbidden');
    return;
});
const getInvitations = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { decoded } = req.body;
        const { companyId, userId } = req.query;
        if (companyId)
            yield checkUserRole(companyId, decoded.userId);
        if (userId)
            yield checkUserId(userId, decoded.userId);
        if (!companyId && !userId)
            yield checkAdmin(decoded.userId);
        const searchField = Object.assign({}, { companyId, userId });
        const invitations = yield prisma_1.default.invitation.findMany({
            where: searchField,
            include: {
                company: {
                    select: { name: true }
                }
            }
        });
        res.json((0, response_1.default)('success', { invitations }));
    });
};
exports.default = getInvitations;
