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
const generateToken_1 = __importDefault(require("../lib/generateToken"));
const prisma_1 = __importDefault(require("./prisma"));
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.create({
        data: {
            name: 'Muhammad Ilham',
            phone: '082166689693',
            role: 'USER'
        }
    });
    yield prisma_1.default.session.create({
        data: {
            userId: user.id,
            token: (0, generateToken_1.default)({ userId: user.id })
        }
    });
});
const seed_session = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: 'f9b8da26-2dec-453a-aded-a3726b929cfb' }
    });
    if (!user)
        throw new Error('user not found');
    yield prisma_1.default.session.create({
        data: {
            token: (0, generateToken_1.default)({ userId: user.id }),
            userId: user.id
        }
    });
});
seed()
    .then(() => console.log('success'));
// seed_session()
//     .then(() => console.log('success'))
