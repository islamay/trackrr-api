import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../../../config/prisma'
import response from '../../../../lib/response'
import companyMemberAuth from '../../../../middlewares/auth/companyMemberAuth'
import workshiftAuth, { IBodyAfterWorkshiftAuth } from '../../../../middlewares/auth/workshiftAuth'
import verifyToken from '../../../../middlewares/verifyToken'
import validatePayload from '../../../../middlewares/validatePayload'
import ConflictError from '../../../../errors/ConflictError'
import ValidationError from '../../../../errors/ValidationError'
import ForbiddenError from '../../../../errors/ForbiddenError'

interface IParams {
    companyId: string,
    workshiftId: string
}
interface IBody extends IBodyAfterWorkshiftAuth {
    workshiftMemberId: string
}
interface IQuery { }

export const validateCreateAttendance = [
    verifyToken(),
    companyMemberAuth('companyId'),
    workshiftAuth(),
    body('workshiftMemberId').notEmpty().isUUID().bail().custom((i, { req }) => {
        const { workshiftMemberId, workshiftMember } = req.body as IBody
        if (workshiftMemberId !== workshiftMember.id) {
            req.body.error = new ForbiddenError('Forbidden')
            return false
        } else {
            return true
        }
    }),
    validatePayload(),
]

const createAttendance = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { workshiftMemberId, workshiftMember } = req.body

        const date = new Date()
        const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const isTodayAttendanceCreated = await client.attendance.findFirst({
            where: {
                workshiftId: workshiftMember.workshiftId,
                workshiftMemberId: workshiftMemberId,
                checkedInTime: {
                    gte: today,
                    lt: tomorrow
                }
            }
        })

        if (isTodayAttendanceCreated) throw new ConflictError('Your attendance for today already exist')

        const attendance = await client.attendance.create({
            data: {
                workshiftId: workshiftMember.workshiftId,
                workshiftMemberId: workshiftMemberId,
                status: 'ONGOING',
            }
        })

        res.status(201).json(response('success', { attendance }))
    }
}

export default createAttendance