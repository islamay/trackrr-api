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
exports.validateDeleteCompany = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateDeleteCompany = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)('ADMIN'),
];
const deleteCompany = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const company = yield prisma_1.default.company.findUnique({
            where: { id: req.params.companyId },
            include: {
                members: true,
                workshifts: {
                    include: { members: true }
                }
            }
        });
        if (!company)
            throw new NoContentError_1.default('Company not found');
        yield prisma_1.default.company.delete({ where: { id: req.params.companyId } });
        res.json((0, response_1.default)('success', { company }));
    });
};
exports.default = deleteCompany;
