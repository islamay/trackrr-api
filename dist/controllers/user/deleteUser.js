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
exports.validateDeleteUser = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const validatePayload_1 = __importDefault(require("../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateDeleteUser = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)(),
    (0, express_validator_1.param)('userId')
        .notEmpty()
        .custom((i, m) => {
        if (i !== m.req.body.decoded.userId &&
            m.req.body.session.user.role !== 'ADMIN') {
            m.req.body.error = new ForbiddenError_1.default('Forbidden');
            return false;
        }
        return true;
    }),
    (0, validatePayload_1.default)(),
];
const deleteUser = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({ where: { id: req.params.userId } });
        if (!user)
            throw new NoContentError_1.default('User not found');
        yield prisma_1.default.user.delete({ where: { id: req.params.userId } });
        res.json((0, response_1.default)('success', { user }));
    });
};
exports.default = deleteUser;
