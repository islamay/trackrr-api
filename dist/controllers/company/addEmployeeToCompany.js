"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.validateAddEmployeeToCompany = void 0;
const express_validator_1 = require("express-validator");
const ConflictError_1 = __importDefault(require("../../errors/ConflictError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../errors/NoContentError"));
const ValidationError_1 = __importDefault(require("../../errors/ValidationError"));
const roleAuth_1 = __importDefault(require("../../lib/roleAuth"));
const company_1 = __importStar(require("../../models/company"));
const user_1 = __importDefault(require("../../models/user"));
exports.validateAddEmployeeToCompany = [
    (0, express_validator_1.param)('companyId').notEmpty().isMongoId().bail(),
    (0, express_validator_1.body)('userId').notEmpty().isMongoId().bail(),
    (0, express_validator_1.body)('role').notEmpty().isString().custom((v, m) => {
        const isValidRole = Object.values(company_1.CompanyRole).some(r => v === r);
        if (isValidRole)
            return true;
        m.req.body.error = new ValidationError_1.default('Role is not valid');
        return false;
    })
];
const addEmployeeToCompany = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const company = yield company_1.default.findById(req.params.companyId);
        if (!company)
            throw new NoContentError_1.default('Company not found');
        const user = yield user_1.default.findById(req.body.userId);
        if (!user)
            throw new NoContentError_1.default('User not found');
        const isAllowed = (0, roleAuth_1.default)([company_1.CompanyRole.OWNER, company_1.CompanyRole.OPERATOR], req.body.user, company);
        if (!isAllowed)
            throw new ForbiddenError_1.default('Forbidden');
        const userExistInCompany = company.users.some(userId => userId === req.body.userId);
        if (!userExistInCompany)
            throw new ConflictError_1.default('User already exists in company');
        company.users = [...company.users, req.body.userId];
        user.companies = [];
        res.sendStatus(200);
    });
};
exports.default = addEmployeeToCompany;
