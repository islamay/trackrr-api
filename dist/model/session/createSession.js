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
exports.createSession = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const generateToken_1 = __importDefault(require("../../lib/generateToken"));
const createSession = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield prisma_1.default.session.count({
        where: {
            userId
        },
    });
    if (count >= 5) {
        const tokens = yield prisma_1.default.session.findMany({
            where: { userId },
            orderBy: { created: 'asc' },
            take: count - 5 - 1
        });
        yield prisma_1.default.session.deleteMany({
            where: {
                id: {
                    in: tokens.map(session => session.id)
                }
            }
        });
    }
    const token = (0, generateToken_1.default)({ userId });
    const session = yield prisma_1.default.session.create({ data: { userId, token } });
    console.log(token);
    console.log(session.token);
    return session;
});
exports.createSession = createSession;
