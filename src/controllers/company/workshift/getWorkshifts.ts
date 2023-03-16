import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../../config/prisma'
import response from '../../../lib/response'
import companyMemberAuth from '../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../middlewares/validatePayload'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody { }
interface IQuery { }

export const validateGetWorkshifts = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId')
]

const getWorkshifts = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const workshifts = await client.workshift.findMany({
            where: { companyId: req.params.companyId }
        })

        res.json(response('success', { workshifts }))
    }
}

export default getWorkshifts