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
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../config/prisma"));
const AuthorizationError_1 = __importDefault(require("../../errors/AuthorizationError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const memberRole = (id, roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield prisma_1.default.session.findFirst({
            where: { userId: req.body.decoded.userId, token: req.body.token },
            include: { user: { include: { companies: true } } }
        });
        if (!session)
            throw new AuthorizationError_1.default('Token is not valid');
        req.body.session = session;
        if (session.user.role === client_1.UserRole.ADMIN)
            return next();
        const thisMember = session.user.companies.find((c) => c.companyId === req.params[id]);
        if (!thisMember)
            throw new ForbiddenError_1.default('Forbidden');
        if (!roles)
            return next();
        if (roles.some(role => role === thisMember.role))
            return next();
        throw new ForbiddenError_1.default('Forbidden2');
    });
};
exports.default = memberRole;
