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
exports.validatePatchUser = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../config/prisma"));
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const phoneFormatter_1 = __importDefault(require("../../lib/phoneFormatter"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const validatePayload_1 = __importDefault(require("../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validatePatchUser = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)(),
    (0, express_validator_1.param)('userId')
        .notEmpty(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(Object.values(client_1.UserRole)),
    (0, express_validator_1.body)('phone')
        .optional()
        .isMobilePhone('id-ID'),
    (0, validatePayload_1.default)()
];
const patchUser = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, phone, role, session } = req.body;
        const user = yield prisma_1.default.user.findUnique({ where: { id: req.params.userId } });
        if (!user)
            throw new NoContentError_1.default('User not found');
        if (!isTheUserItself(session.user, req.params.userId))
            throw new ForbiddenError_1.default('Forbidden');
        if (role && !isAuthorizedToUpdateRole(user))
            throw new ForbiddenError_1.default('Forbidden');
        if (phone && !isPhoneNumberAvailable(phone))
            throw new ConflictError_1.default('Phone number already used');
        const updatedField = Object.assign({}, { name, phone, role });
        const updated = yield prisma_1.default.user.update({
            where: { id: req.params.userId },
            data: updatedField
        });
        res.json((0, response_1.default)('success', { user: updated }));
    });
};
const isTheUserItself = (user, requestedUserId) => {
    if (user.id === requestedUserId || user.role === 'ADMIN')
        return true;
    return false;
};
const isAuthorizedToUpdateRole = (user) => {
    if (user.role === 'ADMIN')
        return true;
    return false;
};
const isPhoneNumberAvailable = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield prisma_1.default.user.findFirst({
        where: { phone: (0, phoneFormatter_1.default)(phone) }
    });
    return !!isExist;
});
exports.default = patchUser;
