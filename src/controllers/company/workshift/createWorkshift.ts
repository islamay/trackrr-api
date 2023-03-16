import { RequestHandler } from 'express'
import { body, param } from 'express-validator'
import client from '../../../config/prisma'
import { dateValidator } from '../../../lib/dateValidator'
import response from '../../../lib/response'
import companyMemberAuth from '../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../middlewares/validatePayload'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
}
interface IBody {
    name: string
    workingStart: string
    workingEnd: string
}
interface IQuery { }

export const validateCreateWorkshift = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR']),
    body('name').notEmpty().isString(),
    body('workingStart').notEmpty().isString()
        .custom((i) => dateValidator(i)),
    body('workingEnd').notEmpty().isString()
        .custom((i) => dateValidator(i)),
    validatePayload(),
]

const createWorkshift = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { name, workingStart, workingEnd } = req.body
        const workshift = await client.workshift.create({
            data: {
                companyId: req.params.companyId,
                name, workingStart, workingEnd,
            }
        })

        res.status(201).json(response('success', { workshift }))
    }
}

export default createWorkshift