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
exports.validateInvitationAction = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const GoneError_1 = __importDefault(require("../../errors/GoneError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const response_1 = __importDefault(require("../../lib/response"));
exports.validateInvitationAction = [
    (0, express_validator_1.body)('action').notEmpty().isIn(Object.values([
        client_1.InvitationState.ACCEPTED,
        client_1.InvitationState.REJECTED
    ]))
];
const invitationAction = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { decoded, action } = req.body;
        const invitation = yield prisma_1.default.invitation.findUnique({ where: { id: req.params.invitationId } });
        if (!isInvitationExist(invitation))
            throw new NoContentError_1.default('Invitation not found');
        if (!isReceiver(decoded.userId, invitation))
            throw new ForbiddenError_1.default('Forbidden');
        if (isInvitationUsed(invitation))
            throw new ForbiddenError_1.default('Forbidden');
        if (isInvitationExpired(invitation))
            throw new GoneError_1.default('Invitation expired');
        const updated = req.body.action === 'ACCEPT'
            ? yield acceptInvitation(decoded.userId, invitation)
            : yield rejectInvitation(invitation);
        res.json((0, response_1.default)('success', { invitation: updated }));
    });
};
const isInvitationExist = (invitation) => {
    if (!invitation)
        return false;
    return true;
};
const isInvitationExpired = (invitation) => {
    if (Date.now() > invitation.expiresIn.getTime())
        return false;
    return true;
};
const isInvitationUsed = (invitation) => {
    if (invitation.status !== 'PENDING')
        return false;
    return true;
};
const isReceiver = (userId, invitation) => {
    if (invitation.receiverId !== userId)
        return false;
    return true;
};
const acceptInvitation = (userId, invitation) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield prisma_1.default.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma_1.default.companyMember.create({
            data: {
                companyId: updated.companyId,
                userId: updated.receiverId
            }
        });
        return yield prisma_1.default.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' }
        });
    }));
    return updated;
});
const rejectInvitation = (invitation) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield prisma_1.default.invitation.update({
        where: { id: invitation.id },
        data: { status: client_1.InvitationState.REJECTED }
    });
    return updated;
});
exports.default = invitationAction;
