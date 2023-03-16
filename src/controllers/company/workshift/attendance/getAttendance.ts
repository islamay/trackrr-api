import { Attendance, WorkshiftMember } from '@prisma/client'
import { Request, RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../../../config/prisma'
import ForbiddenError from '../../../../errors/ForbiddenError'
import NoContentError from '../../../../errors/NoContentError'
import response from '../../../../lib/response'
import companyMemberAuth, { IBodyAfterMemberRole } from '../../../../middlewares/auth/companyMemberAuth'
import verifyToken from '../../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    workshiftId: string
    attendanceId: string
}
interface IBody extends IBodyAfterMemberRole {
    attendance: Attendance & { workshiftMember?: WorkshiftMember }
}
interface IQuery { }

export const validateGetAttendance: Array<RequestHandler<any, any, any, any>> = [
    verifyToken(),
    companyMemberAuth('companyId'),
    async (req: Request<IParams, {}, IBody, IQuery>, res, next) => {
        const attendance = await client.attendance.findUnique({
            where: { id: req.params.attendanceId },
            include: {
                workshiftMember: true
            }
        })

        if (!attendance) throw new NoContentError('Attendance not found')
        req.body.attendance = attendance

        if (req.body.session.user.role === 'ADMIN') return next()
        else if (req.body.membership.role === 'OWNER' || req.body.membership.role === 'OPERATOR') return next()
        else if (req.body.membership.id === attendance.workshiftMember.companyMemberId) return next()
        else throw new ForbiddenError('Forbidden')
    }
]

const getAttendance = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { attendance } = req.body
        delete attendance.workshiftMember

        res.json(response('success', { attendance }))
    }
}

export default getAttendance