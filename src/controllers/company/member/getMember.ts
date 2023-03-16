import { RequestHandler } from 'express'
import client from '../../../config/prisma'
import NoContentError from '../../../errors/NoContentError'
import response from '../../../lib/response'
import companyMemberAuth from '../../../middlewares/auth/companyMemberAuth'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string,
    memberId: string
}
interface IBody { }
interface IQuery { }

export const validateGetMember = [
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR', 'MEMBER'])
]

const getMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const member = await client.companyMember.findUnique({
            where: { id: req.params.memberId },
            include: {
                user: true,
                workshifts: true
            }
        })
        if (!member) throw new NoContentError('Company Member not found')

        res.json(response('success', { member }))
    }
}

export default getMember