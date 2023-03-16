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
const prisma_1 = __importDefault(require("../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const GoneError_1 = __importDefault(require("../../errors/GoneError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const ServerError_1 = __importDefault(require("../../errors/ServerError"));
const response_1 = __importDefault(require("../../lib/response"));
const acceptInvitation = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { decoded: { userId } } = req.body;
        const invitation = yield prisma_1.default.invitation.findUnique({
            where: { id: req.params.invitationId }
        });
        if (!invitation)
            throw new NoContentError_1.default('Invitation not found');
        if (invitation.receiverId !== userId)
            throw new ForbiddenError_1.default('Forbidden');
        if (Date.now() > invitation.expiresIn.getTime())
            throw new GoneError_1.default('Invitation expired');
        let updated;
        try {
            yield prisma_1.default.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
                updated = yield prisma_1.default.invitation.update({
                    where: { id: invitation.id },
                    data: { status: 'ACCEPTED' }
                });
                yield prisma_1.default.companyMember.create({
                    data: {
                        userId: userId,
                        companyId: invitation.companyId,
                    }
                });
            }));
        }
        catch (error) {
            console.log(error);
            throw new ServerError_1.default('Server error');
        }
        res.status(201).json((0, response_1.default)('success', { invitation: updated }));
    });
};
exports.default = acceptInvitation;
