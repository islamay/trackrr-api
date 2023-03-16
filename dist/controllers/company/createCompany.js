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
exports.validateCreateCompany = void 0;
const response_1 = __importDefault(require("../../lib/response"));
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../config/prisma"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const validatePayload_1 = __importDefault(require("../../middlewares/validatePayload"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const client_1 = require("@prisma/client");
exports.validateCreateCompany = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)(client_1.UserRole.ADMIN),
    (0, express_validator_1.body)('name').notEmpty().isString(),
    (0, validatePayload_1.default)(),
];
const createCompany = () => {
    return ({ body: { name, decoded } }, res) => __awaiter(void 0, void 0, void 0, function* () {
        const company = yield prisma_1.default.company.create({
            data: { name }
        });
        res.status(201).json((0, response_1.default)('success', { company }));
    });
};
exports.default = createCompany;
