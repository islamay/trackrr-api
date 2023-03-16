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
const prisma_1 = __importDefault(require("../config/prisma"));
const NoContentError_1 = __importDefault(require("../errors/NoContentError"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const phoneFormatter_1 = __importDefault(require("../lib/phoneFormatter"));
const validatePhone = (checkUser) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const phone = req.body.phone || '';
        if (typeof phone !== 'string')
            throw new ValidationError_1.default('Phone number invalid');
        const formattedPhone = (0, phoneFormatter_1.default)(phone);
        if (!formattedPhone)
            throw new ValidationError_1.default('Phone number invalid');
        req.body.phone = formattedPhone;
        if (!checkUser)
            return next();
        const user = yield prisma_1.default.user.findUnique({
            where: { phone: formattedPhone }
        });
        if (!user)
            throw new NoContentError_1.default('Phone number not registered');
        req.body.user = user;
        next();
    });
};
exports.default = validatePhone;
