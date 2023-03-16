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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createCompany_1 = __importStar(require("../controllers/company/createCompany"));
const getCompany_1 = __importStar(require("../controllers/company/getCompany"));
const createCompanyMember_1 = __importStar(require("../controllers/company/member/createCompanyMember"));
const getMembers_1 = __importStar(require("../controllers/company/member/getMembers"));
const getMember_1 = __importStar(require("../controllers/company/member/getMember"));
const patchMember_1 = __importStar(require("../controllers/company/member/patchMember"));
const deleteMember_1 = __importStar(require("../controllers/company/member/deleteMember"));
const getCompanies_1 = __importStar(require("../controllers/company/getCompanies"));
const patchCompany_1 = __importStar(require("../controllers/company/patchCompany"));
const deleteCompany_1 = __importStar(require("../controllers/company/deleteCompany"));
const getWorkshift_1 = __importStar(require("../controllers/company/workshift/getWorkshift"));
const getWorkshifts_1 = __importStar(require("../controllers/company/workshift/getWorkshifts"));
const createWorkshift_1 = __importStar(require("../controllers/company/workshift/createWorkshift"));
const patchWorkshift_1 = __importStar(require("../controllers/company/workshift/patchWorkshift"));
const deleteWorkshift_1 = __importStar(require("../controllers/company/workshift/deleteWorkshift"));
const getWorkshiftMember_1 = __importStar(require("../controllers/company/workshift/member/getWorkshiftMember"));
const getWorkshiftMembers_1 = __importStar(require("../controllers/company/workshift/member/getWorkshiftMembers"));
const deleteWorkshiftMember_1 = __importStar(require("../controllers/company/workshift/member/deleteWorkshiftMember"));
const createWorkshiftMember_1 = __importStar(require("../controllers/company/workshift/member/createWorkshiftMember"));
const getAttendance_1 = __importStar(require("../controllers/company/workshift/attendance/getAttendance"));
const getAttendances_1 = __importStar(require("../controllers/company/workshift/attendance/getAttendances"));
const createAttendance_1 = __importStar(require("../controllers/company/workshift/attendance/createAttendance"));
const patchAttendance_1 = __importStar(require("../controllers/company/workshift/attendance/patchAttendance"));
// TODO : Add each route a validator
const createCompanyRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/', getCompanies_1.validateGetCompanies, (0, getCompanies_1.default)());
    router.post('/', createCompany_1.validateCreateCompany, (0, createCompany_1.default)());
    router.get('/:companyId', getCompany_1.validateGetCompany, (0, getCompany_1.default)());
    router.patch('/:companyId', patchCompany_1.validatePatchCompany, (0, patchCompany_1.default)());
    router.delete('/:companyId', deleteCompany_1.validateDeleteCompany, (0, deleteCompany_1.default)());
    // * Company Member
    router.get('/:companyId/members', getMembers_1.validateGetMembers, (0, getMembers_1.default)());
    router.post('/:companyId/members', createCompanyMember_1.validateCreateCompanyMember, (0, createCompanyMember_1.default)());
    router.get('/:companyId/members/:memberId', getMember_1.validateGetMember, (0, getMember_1.default)());
    router.patch('/:companyId/members/:memberId', patchMember_1.validatePatchMember, (0, patchMember_1.default)());
    router.delete('/:companyId/members/:memberId', deleteMember_1.validateDeleteMember, (0, deleteMember_1.default)());
    // * Workshift
    router.get('/:companyId/workshifts', getWorkshifts_1.validateGetWorkshifts, (0, getWorkshifts_1.default)());
    router.post('/:companyId/workshifts', createWorkshift_1.validateCreateWorkshift, (0, createWorkshift_1.default)());
    router.get('/:companyId/workshifts/:workshiftId', getWorkshift_1.validateGetWorkshift, (0, getWorkshift_1.default)());
    router.patch('/:companyId/workshifts/:workshiftId', patchWorkshift_1.validatePatchWorkshift, (0, patchWorkshift_1.default)());
    router.delete('/:companyId/workshifts/:workshiftId', deleteWorkshift_1.validateDeleteWorkshift, (0, deleteWorkshift_1.default)());
    // * Workshift Member
    router.get('/:companyId/workshifts/:workshiftId/members', getWorkshiftMembers_1.validateGetWorkshiftMembers, (0, getWorkshiftMembers_1.default)());
    router.post('/:companyId/workshifts/:workshiftId/members', createWorkshiftMember_1.validateCreateWorkshiftMember, (0, createWorkshiftMember_1.default)());
    router.get('/:companyId/workshifts/:workshiftId/members/:workshiftMemberId', getWorkshiftMember_1.validateGetWorkshiftMember, (0, getWorkshiftMember_1.default)());
    router.delete('/:companyId/workshifts/:workshiftId/members/:workshiftMemberId', deleteWorkshiftMember_1.validateDeleteWorkshiftMember, (0, deleteWorkshiftMember_1.default)());
    // * Workshift Attendance
    router.get('/:companyId/workshifts/:workshiftId/attendances', getAttendances_1.validateGetAttendances, (0, getAttendances_1.default)());
    router.post('/:companyId/workshifts/:workshiftId/attendances', createAttendance_1.validateCreateAttendance, (0, createAttendance_1.default)());
    router.get('/:companyId/workshifts/:workshiftId/attendances/:attendanceId', getAttendance_1.validateGetAttendance, (0, getAttendance_1.default)());
    router.patch('/:companyId/workshifts/:workshiftId/attendances/:attendanceId', patchAttendance_1.validatePatchAttendance, (0, patchAttendance_1.default)());
    return router;
};
exports.default = createCompanyRouter;
