import { RequestHandler } from 'express'
import client from '../../../config/prisma'
import ForbiddenError from '../../../errors/ForbiddenError'
import NoContentError from '../../../errors/NoContentError'
import response from '../../../lib/response'
import companyMemberAuth, { IBodyAfterMemberRole } from '../../../middlewares/auth/companyMemberAuth'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    memberId: string
}
interface IBody extends IBodyAfterMemberRole { }
interface IQuery { }

export const validateDeleteMember = [
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR'])
]

const deleteMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const member = await client.companyMember.findUnique({
            where: { id: req.params.memberId },
            include: { workshifts: true }
        })
        if (!member) throw new NoContentError('Member not found')
        if (member.role === 'OWNER' && req.body.session.user.role !== 'ADMIN')
            throw new ForbiddenError('Forbidden')

        await client.companyMember.delete({ where: { id: req.params.memberId } })
        res.json(response('success', { member }))
    }
}

export default deleteMember