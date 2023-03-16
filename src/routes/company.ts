import { Router } from 'express'
import createCompany, { validateCreateCompany } from '../controllers/company/createCompany'
import getCompany, { validateGetCompany } from '../controllers/company/getCompany'
import createCompanyMember, { validateCreateCompanyMember } from '../controllers/company/member/createCompanyMember'
import getMembers, { validateGetMembers } from '../controllers/company/member/getMembers'
import getMember, { validateGetMember } from '../controllers/company/member/getMember'
import patchMember, { validatePatchMember } from '../controllers/company/member/patchMember'
import deleteMember, { validateDeleteMember } from '../controllers/company/member/deleteMember'
import getCompanies, { validateGetCompanies } from '../controllers/company/getCompanies'
import patchCompany, { validatePatchCompany } from '../controllers/company/patchCompany'
import deleteCompany, { validateDeleteCompany } from '../controllers/company/deleteCompany'
import getWorkshift, { validateGetWorkshift } from '../controllers/company/workshift/getWorkshift'
import getWorkshifts, { validateGetWorkshifts } from '../controllers/company/workshift/getWorkshifts'
import createWorkshift, { validateCreateWorkshift } from '../controllers/company/workshift/createWorkshift'
import patchWorkshift, { validatePatchWorkshift } from '../controllers/company/workshift/patchWorkshift'
import deleteWorkshift, { validateDeleteWorkshift } from '../controllers/company/workshift/deleteWorkshift'
import getWorkshiftMember, { validateGetWorkshiftMember } from '../controllers/company/workshift/member/getWorkshiftMember'
import getWorkshiftMembers, { validateGetWorkshiftMembers } from '../controllers/company/workshift/member/getWorkshiftMembers'
import deleteWorkshiftMember, { validateDeleteWorkshiftMember } from '../controllers/company/workshift/member/deleteWorkshiftMember'
import createWorkshiftMember, { validateCreateWorkshiftMember } from '../controllers/company/workshift/member/createWorkshiftMember'
import getAttendance, { validateGetAttendance } from '../controllers/company/workshift/attendance/getAttendance'
import getAttendances, { validateGetAttendances } from '../controllers/company/workshift/attendance/getAttendances'
import createAttendance, { validateCreateAttendance } from '../controllers/company/workshift/attendance/createAttendance'
import patchAttendance, { validatePatchAttendance } from '../controllers/company/workshift/attendance/patchAttendance'

// TODO : Add each route a validator

const createCompanyRouter = () => {
    const router = Router()
    router.get('/', validateGetCompanies, getCompanies())
    router.post('/', validateCreateCompany, createCompany())
    router.get('/:companyId', validateGetCompany, getCompany())
    router.patch('/:companyId', validatePatchCompany, patchCompany())
    router.delete('/:companyId', validateDeleteCompany, deleteCompany())

    // * Company Member
    router.get('/:companyId/members', validateGetMembers, getMembers())
    router.post('/:companyId/members', validateCreateCompanyMember, createCompanyMember())
    router.get('/:companyId/members/:memberId', validateGetMember, getMember())
    router.patch('/:companyId/members/:memberId', validatePatchMember, patchMember())
    router.delete('/:companyId/members/:memberId', validateDeleteMember, deleteMember())

    // * Workshift
    router.get('/:companyId/workshifts', validateGetWorkshifts, getWorkshifts())
    router.post('/:companyId/workshifts', validateCreateWorkshift, createWorkshift())
    router.get('/:companyId/workshifts/:workshiftId', validateGetWorkshift, getWorkshift())
    router.patch('/:companyId/workshifts/:workshiftId', validatePatchWorkshift, patchWorkshift())
    router.delete('/:companyId/workshifts/:workshiftId', validateDeleteWorkshift, deleteWorkshift())

    // * Workshift Member
    router.get('/:companyId/workshifts/:workshiftId/members', validateGetWorkshiftMembers, getWorkshiftMembers())
    router.post('/:companyId/workshifts/:workshiftId/members', validateCreateWorkshiftMember, createWorkshiftMember())
    router.get('/:companyId/workshifts/:workshiftId/members/:workshiftMemberId', validateGetWorkshiftMember, getWorkshiftMember())
    router.delete('/:companyId/workshifts/:workshiftId/members/:workshiftMemberId', validateDeleteWorkshiftMember, deleteWorkshiftMember())

    // * Workshift Attendance
    router.get('/:companyId/workshifts/:workshiftId/attendances', validateGetAttendances, getAttendances())
    router.post('/:companyId/workshifts/:workshiftId/attendances', validateCreateAttendance, createAttendance())
    router.get('/:companyId/workshifts/:workshiftId/attendances/:attendanceId', validateGetAttendance, getAttendance())
    router.patch('/:companyId/workshifts/:workshiftId/attendances/:attendanceId', validatePatchAttendance, patchAttendance())

    return router
}


export default createCompanyRouter