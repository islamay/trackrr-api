import { Attendance, AttendanceStatus } from '@prisma/client'
import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../../../config/prisma'
import ForbiddenError from '../../../../errors/ForbiddenError'
import NoContentError from '../../../../errors/NoContentError'
import response from '../../../../lib/response'
import companyMemberAuth from '../../../../middlewares/auth/companyMemberAuth'
import workshiftAuth, { IBodyAfterWorkshiftAuth } from '../../../../middlewares/auth/workshiftAuth'
import validatePayload from '../../../../middlewares/validatePayload'
import verifyToken from '../../../../middlewares/verifyToken'

interface IParams {
    attendanceId: string
}
interface IBody extends IBodyAfterWorkshiftAuth {
    status: AttendanceStatus,
    attendance: Attendance
}
interface IQuery { }

export const validatePatchAttendance: Array<RequestHandler<any, any, any, any>> = [
    verifyToken(),
    companyMemberAuth('companyId'),
    workshiftAuth(),
    async (req, res, next) => {

        const attendance = await client.attendance.findUnique({
            where: { id: req.params.attendanceId }
        })
        if (!attendance) throw new NoContentError('Attendance not found')
        if (attendance.status === 'DONE') throw new ForbiddenError('Forbidden')
        if (req.body.workshiftMember.id !== attendance.workshiftMemberId) throw new ForbiddenError('Forbidden')
        req.body.attendance = attendance
        return next()
    },
    body('status').optional().equals(AttendanceStatus.DONE),
    validatePayload(),
]

const patchAttendance = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {

        const updated = await client.attendance.update({
            where: { id: req.body.attendance.id },
            data: { status: req.body.status }
        })

        return res.json(response('success', { attendance: updated }))
    }
}

export default patchAttendance