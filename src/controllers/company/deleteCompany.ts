import { RequestHandler } from 'express'
import client from '../../config/prisma'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import userAuth from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody { }
interface IQuery { }

export const validateDeleteCompany = [
    verifyToken(),
    userAuth('ADMIN'),
]

const deleteCompany = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const company = await client.company.findUnique({
            where: { id: req.params.companyId },
            include: {
                members: true,
                workshifts: {
                    include: { members: true }
                }
            }
        })

        if (!company) throw new NoContentError('Company not found')

        await client.company.delete({ where: { id: req.params.companyId } })
        res.json(response('success', { company }))
    }
}

export default deleteCompany