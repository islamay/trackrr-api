import { MemberRole, UserRole } from '@prisma/client'
import { RequestHandler } from 'express'
import { param, body } from 'express-validator'
import client from '../../../config/prisma'
import ConflictError from '../../../errors/ConflictError'
import ForbiddenError from '../../../errors/ForbiddenError'
import NoContentError from '../../../errors/NoContentError'
import response from '../../../lib/response'
import userRole, { IBodyAfterUserAuth } from '../../../middlewares/auth/userAuth'
import validatePayload from '../../../middlewares/validatePayload'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody extends IBodyAfterUserAuth {
    userId: string
    role?: MemberRole
}
interface IQuery { }

export const validateCreateCompanyMember = [
    verifyToken(),
    userRole('ADMIN'),
    param('companyId').notEmpty(),
    body('userId').notEmpty().isUUID().bail(),
    body('role').optional().isIn(Object.values(MemberRole)),
    validatePayload(),
]

const createCompanyMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        if (req.body.session.user.role !== UserRole.ADMIN) throw new ForbiddenError('Forbidden')
        const userExist = await client.user.findMany({ where: { id: { equals: req.body.userId } } })
        const userIsCompanyMember = await client.companyMember.count({
            where: {
                companyId: req.params.companyId,
                userId: req.body.userId
            }
        })

        if (!userExist) throw new NoContentError('User not found')
        if (userIsCompanyMember) throw new ConflictError('User already member')

        const member = await client.companyMember.create({
            data: {
                companyId: req.params.companyId,
                userId: req.body.userId,
                role: req.body.role || MemberRole.MEMBER
            }
        })

        res.status(201).json(response('success', { member }))
    }
}

export default createCompanyMember