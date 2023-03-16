import { RequestHandler } from 'express'
import client from '../../config/prisma'
import AuthorizationError from '../../errors/AuthorizationError'
import ForbiddenError from '../../errors/ForbiddenError'
import response from '../../lib/response'
import verifyToken, { IBodyAfterVerifyToken } from '../../middlewares/verifyToken'

interface IParams { }
interface IBody extends IBodyAfterVerifyToken { }
interface IQuery {
    companyId?: string
    userId?: string
}

export const validateGetInvitations = [verifyToken()]

const checkUserRole = async (companyId: string, userId: string) => {
    const member = await client.companyMember.findFirst({
        where: { companyId, userId }
    })

    if (!member) throw new ForbiddenError('Forbidden')
    if (member.role === 'MEMBER') throw new ForbiddenError('Forbidden')
    return;
}

const checkUserId = async (inputUserId: string, userId: string) => {
    if (userId !== inputUserId) throw new ForbiddenError('Forbidden')
    return;
}

const checkAdmin = async (userId: string) => {
    const user = await client.user.findUnique({ where: { id: userId } })
    if (!user) throw new AuthorizationError('Unauthorized')
    if (user.role !== 'ADMIN') throw new ForbiddenError('Forbidden')
    return;
}

const getInvitations = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { decoded } = req.body
        const { companyId, userId } = req.query
        if (companyId) await checkUserRole(companyId, decoded.userId)
        if (userId) await checkUserId(userId, decoded.userId)
        if (!companyId && !userId) await checkAdmin(decoded.userId)

        const searchField = Object.assign({}, { companyId, userId })
        const invitations = await client.invitation.findMany(
            {
                where: searchField,
                include: {
                    company: {
                        select: { name: true }
                    }
                }
            }
        )

        res.json(response('success', { invitations }))
    }
}

export default getInvitations