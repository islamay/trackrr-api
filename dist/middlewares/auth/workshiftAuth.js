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
const prisma_1 = __importDefault(require("../../config/prisma"));
const BaseError_1 = __importDefault(require("../../errors/BaseError"));
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const workshiftAuth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const workshiftMember = yield prisma_1.default.workshiftMember.findFirst({
                where: {
                    workshiftId: req.params.workshiftId,
                    companyMemberId: req.body.membership.id
                }
            });
            if (!workshiftMember)
                throw new ForbiddenError_1.default('Forbidden');
            req.body.workshiftMember = workshiftMember;
            return next();
        }
        catch (error) {
            if (error instanceof BaseError_1.default) {
                throw error;
            }
            else {
                throw new ForbiddenError_1.default('Forbidden');
            }
        }
    });
};
exports.default = workshiftAuth;
