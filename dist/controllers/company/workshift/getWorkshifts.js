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
exports.validateGetWorkshifts = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = __importDefault(require("../../../config/prisma"));
const response_1 = __importDefault(require("../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../middlewares/auth/companyMemberAuth"));
const validatePayload_1 = __importDefault(require("../../../middlewares/validatePayload"));
const verifyToken_1 = __importDefault(require("../../../middlewares/verifyToken"));
exports.validateGetWorkshifts = [
    (0, express_validator_1.param)('companyId').isUUID(),
    (0, validatePayload_1.default)(),
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId')
];
const getWorkshifts = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const workshifts = yield prisma_1.default.workshift.findMany({
            where: { companyId: req.params.companyId }
        });
        res.json((0, response_1.default)('success', { workshifts }));
    });
};
exports.default = getWorkshifts;
