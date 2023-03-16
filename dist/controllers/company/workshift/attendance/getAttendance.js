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
exports.validateGetAttendance = void 0;
const prisma_1 = __importDefault(require("../../../../config/prisma"));
const ForbiddenError_1 = __importDefault(require("../../../../errors/ForbiddenError"));
const NoContentError_1 = __importDefault(require("../../../../errors/NoContentError"));
const response_1 = __importDefault(require("../../../../lib/response"));
const companyMemberAuth_1 = __importDefault(require("../../../../middlewares/auth/companyMemberAuth"));
const verifyToken_1 = __importDefault(require("../../../../middlewares/verifyToken"));
exports.validateGetAttendance = [
    (0, verifyToken_1.default)(),
    (0, companyMemberAuth_1.default)('companyId'),
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const attendance = yield prisma_1.default.attendance.findUnique({
            where: { id: req.params.attendanceId },
            include: {
                workshiftMember: true
            }
        });
        if (!attendance)
            throw new NoContentError_1.default('Attendance not found');
        req.body.attendance = attendance;
        if (req.body.session.user.role === 'ADMIN')
            return next();
        else if (req.body.membership.role === 'OWNER' || req.body.membership.role === 'OPERATOR')
            return next();
        else if (req.body.membership.id === attendance.workshiftMember.companyMemberId)
            return next();
        else
            throw new ForbiddenError_1.default('Forbidden');
    })
];
const getAttendance = () => {
    return (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { attendance } = req.body;
        delete attendance.workshiftMember;
        res.json((0, response_1.default)('success', { attendance }));
    });
};
exports.default = getAttendance;
