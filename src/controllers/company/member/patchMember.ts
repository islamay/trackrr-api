import { MemberRole } from '@prisma/client'
import e, { RequestHandler } from 'express'
import { body } from 'express-validator'
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
interface IBody extends IBodyAfterMemberRole {
    role: MemberRole
}
interface IQuery { }

export const validatePatchMember = [
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR']),
    body('role').optional().isIn(Object.values(MemberRole))
]

const patchMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        if (req.body.role === 'OWNER' && req.body.session.user.role !== 'ADMIN')
            throw new ForbiddenError('Forbidden')

        const member = await client.companyMember.findUnique({
            where: { id: req.params.memberId }
        })


        if (!member) throw new NoContentError('Member not found')
        if (member.role === 'OWNER' && req.body.session.user.role !== 'ADMIN')
            throw new ForbiddenError('Forbidden')

        const updated = await client.companyMember.update({
            where: { id: req.params.memberId },
            data: { role: req.body.role }
        })

        res.json(response('success', { member: updated }))
    }
}

export default patchMember