import { RequestHandler } from 'express'
import client from '../../../config/prisma'
import response from '../../../lib/response'
import companyMemberAuth from '../../../middlewares/auth/companyMemberAuth'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody { }
interface IQuery { }

export const validateGetMembers = [
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR', 'MEMBER'])
]

const getMembers = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const members = await client.companyMember.findMany({
            where: { companyId: req.params.companyId },
            include: { user: true }
        })

        res.json(response('success', { members }))
    }
}

export default getMembers