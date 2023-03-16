import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../config/prisma'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import memberRole from '../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../middlewares/validatePayload'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody { }
interface IQuery { }

export const validateGetCompany = [
    param('companyId').notEmpty(),
    validatePayload(),
    verifyToken(),
    memberRole('companyId', ['OPERATOR']),
]

const getCompany = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const company = await client.company.findUnique({ where: { id: req.params.companyId } })
        if (!company) throw new NoContentError('Company not found')

        res.json(response('success', { company }))
    }
}

export default getCompany