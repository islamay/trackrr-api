import { MemberRole } from '@prisma/client'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { param } from 'express-validator'
import client from '../../../../config/prisma'
import ForbiddenError from '../../../../errors/ForbiddenError'
import NoContentError from '../../../../errors/NoContentError'
import response from '../../../../lib/response'
import companyMemberAuth, { IBodyAfterMemberRole } from '../../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../../middlewares/validatePayload'
import verifyToken from '../../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    workshiftId: string
}
interface IBody extends IBodyAfterMemberRole { }
interface IQuery {
    workshiftMemberId?: string

}

export const validateGetAttendances = [
    verifyToken(),
    companyMemberAuth('companyId'),
    param('workshiftMemberId').optional().isUUID(),
    validatePayload(),
    async (req: Request<IParams, {}, IBody, IQuery>, res: Response, next: NextFunction) => {
        const { membership, session } = req.body
        const { workshiftMemberId } = req.query

        if (session.user.role === 'ADMIN') return next()
        if (membership.role === 'OWNER' || membership.role === 'OPERATOR') return next()
        if (!workshiftMemberId) throw new ForbiddenError('Forbidden')
        if (workshiftMemberId) {
            const workshiftMember = await client.workshiftMember.findUnique({
                where: { id: workshiftMemberId },
            })

            if (!workshiftMember) throw new NoContentError('Workshift member not found')
            if (workshiftMember.companyMemberId !== membership.id) throw new ForbiddenError('Forbidden')
            return next()
        }
    }
]

const getAttendances = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const attendance = await client.attendance.findMany({
            where: {
                workshiftId: req.params.workshiftId,
                workshiftMemberId: req.query.workshiftMemberId
            }
        })

        res.json(response('success', { attendance }))
    }
}

export default getAttendances