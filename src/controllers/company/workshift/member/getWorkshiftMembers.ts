import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../../../config/prisma'
import NoContentError from '../../../../errors/NoContentError'
import response from '../../../../lib/response'
import companyMemberAuth from '../../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../../middlewares/validatePayload'
import verifyToken from '../../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    workshiftId: string
}
interface IBody { }
interface IQuery { }

export const validateGetWorkshiftMembers = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId'),
    param('workshiftId').isUUID(),
    validatePayload(),
]

const getWorkshiftMembers = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const workshift = await client.workshift.findUnique({ where: { id: req.params.workshiftId } })
        if (!workshift) throw new NoContentError('Workshift not found')

        const workshiftMembers = await client.workshiftMember.findMany({
            where: { workshiftId: req.params.workshiftId }
        })

        res.json(response('success', { workshiftMembers }))
    }
}

export default getWorkshiftMembers