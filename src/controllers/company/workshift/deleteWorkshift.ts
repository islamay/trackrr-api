import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../../config/prisma'
import NoContentError from '../../../errors/NoContentError'
import response from '../../../lib/response'
import companyMemberAuth from '../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../middlewares/validatePayload'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    workshiftId: string
}
interface IBody { }
interface IQuery { }

export const validateDeleteWorkshift = [
    param('companyId').isUUID(),
    param('workshiftId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER'])
]

const deleteWorkshift = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const workshift = await client.workshift.findUnique({
            where: { id: req.params.workshiftId },
            include: { members: true }
        })

        if (!workshift) throw new NoContentError('Workshift not found')

        await client.workshift.delete({ where: { id: req.params.workshiftId } })
        res.json(response('success', { workshift }))
    }
}

export default deleteWorkshift