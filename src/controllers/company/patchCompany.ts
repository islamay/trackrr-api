import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../config/prisma'
import ForbiddenError from '../../errors/ForbiddenError'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import companyMemberAuth from '../../middlewares/auth/companyMemberAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody {
    name?: string
}
interface IQuery { }

export const validatePatchCompany = [
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER']),
    body('name').optional().isString(),
]

const patchCompany = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const company = await client.company.findUnique({ where: { id: req.params.companyId } })
        if (!company) throw new NoContentError('Company not found')

        const updated = await client.company.update({
            where: { id: req.params.companyId },
            data: { name: req.body.name }
        })

        res.json(response('success', { company: updated }))
    }
}

export default patchCompany