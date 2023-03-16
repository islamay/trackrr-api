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
exports.validateGetInvitation = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateGetInvitation = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)()
];
const getInvitation = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const invitation = yield prisma_1.default.invitation.findUnique({
            where: { id: req.params.invitationId }
        });
        if (!invitation)
            throw new NoContentError_1.default('Invitation not found');
        if (req.body.session.user.id !== invitation.receiverId ||
            req.body.session.user.id !== invitation.senderId)
            throw new ForbiddenError_1.default('Forbidden');
        res.json((0, response_1.default)('success', { invitation }));
    });
};
exports.default = getInvitation;
