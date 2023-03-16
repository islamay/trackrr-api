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
const AuthorizationError_1 = __importDefault(require("../errors/AuthorizationError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateToken_1 = require("../lib/generateToken");
const prisma_1 = __importDefault(require("../config/prisma"));
const memberRoleAuth = (roles) => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const bearerToken = req.headers.authorization || '';
        const token = bearerToken.replace(/^Bearer /, '');
        try {
            const decoded = jsonwebtoken_1.default.verify(token, env_1.secretKey);
            if (typeof decoded !== 'object')
                throw new AuthorizationError_1.default('Token is not valid');
            if (!(0, generateToken_1.instanceOfTokenPayload)(decoded))
                throw new AuthorizationError_1.default('Token is not valid');
            const user = yield prisma_1.default.user.findUnique({
                where: { id: decoded.userId },
                include: { companies: true }
            });
            if (!user)
                throw new AuthorizationError_1.default('User is not active');
            req.body = Object.assign(Object.assign({}, req.body), { user, decoded });
            if (!role)
                return next();
            if (role === UserRole.USER && role !== user.role)
                throw new ForbiddenError('Forbidden');
            if (role === UserRole.ADMIN && role !== user.role)
                throw new ForbiddenError('Forbidden');
            next();
        }
        catch (error) {
            console.log('error');
            if (error instanceof BaseError)
                next(error);
            else
                throw new AuthorizationError_1.default('Token is not valid');
        }
    });
};
exports.default = memberRoleAuth;
