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
exports.validateCreateWorkshift = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const dateValidator_1 = require("../../../lib/dateValidator");
const response_1 = __importDefault(require("../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../middlewares/auth/companyMemberAuth"));
const validatePayload_1 = __importDefault(require("../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../middlewares/verifyToken"));
exports.validateCreateWorkshift = [
    (0, express_validator_1.param)('companyId').isUUID(),
    (0, validatePayload_1.default)(),
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId', ['OWNER', 'OPERATOR']),
    (0, express_validator_1.body)('name').notEmpty().isString(),
    (0, express_validator_1.body)('workingStart').notEmpty().isString()
        .custom((i) => (0, dateValidator_1.dateValidator)(i)),
    (0, express_validator_1.body)('workingEnd').notEmpty().isString()
        .custom((i) => (0, dateValidator_1.dateValidator)(i)),
    (0, validatePayload_1.default)(),
];
const createWorkshift = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, workingStart, workingEnd } = req.body;
        const workshift = yield prisma_1.default.workshift.create({
            data: {
                companyId: req.params.companyId,
                name, workingStart, workingEnd,
            }
        });
        res.status(201).json((0, response_1.default)('success', { workshift }));
    });
};
exports.default = createWorkshift;
