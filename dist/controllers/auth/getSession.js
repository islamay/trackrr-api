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
exports.validateGetSession = void 0;
const ForbiddenError_1 = __importDefault(require("../../errors/ForbiddenError"));
const response_1 = __importDefault(require("../../lib/response"));
const userAuth_1 = __importDefault(require("../../middlewares/auth/userAuth"));
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
exports.validateGetSession = [
    (0, verifyToken_1.default)(),
    (0, userAuth_1.default)(),
];
const getSession = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const session = req.body.session;
        delete session.user;
        if (session.id !== req.params.sessionId)
            throw new ForbiddenError_1.default('Forbidden');
        res.json((0, response_1.default)('success', { session }));
    });
};
exports.default = getSession;
