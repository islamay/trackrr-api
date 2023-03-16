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
exports.createTokens = exports.createToken = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const generateToken_1 = __importDefault(require("../lib/generateToken"));
const createToken = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('creating user token...');
    const token = yield prisma_1.default.token.create({
        data: {
            userId,
            token: (0, generateToken_1.default)({ userId })
        }
    });
    console.log('done');
    return token;
});
exports.createToken = createToken;
const createTokens = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('geeloo');
});
exports.createTokens = createTokens;
