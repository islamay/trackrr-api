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
exports.validateCreateUser = void 0;
const client_1 = require("@prisma/client");
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../config/prisma"));
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const validatePayload_1 = __importDefault(require("../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateCreateUser = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)('ADMIN'),
    (0, express_validator_1.body)('name').notEmpty(),
    (0, express_validator_1.body)('phone').notEmpty().isMobilePhone('id-ID'),
    (0, express_validator_1.body)('role').optional().isIn(Object.values(client_1.UserRole)),
    (0, validatePayload_1.default)()
];
const createUser = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, phone, role } = req.body;
        const userExist = yield prisma_1.default.user.findUnique({ where: { phone } });
        if (userExist)
            throw new ConflictError_1.default('Phone number already used');
        const user = yield prisma_1.default.user.create({
            data: {
                name,
                phone,
                role
            }
        });
        res.status(201).json((0, response_1.default)('success', { user }));
    });
};
exports.default = createUser;
