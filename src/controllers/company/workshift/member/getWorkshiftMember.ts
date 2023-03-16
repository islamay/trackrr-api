import { verify } from 'crypto'
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
    workshiftMemberId: string
}
interface IBody { }
interface IQuery { }

export const validateGetWorkshiftMember = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId'),
    param('workshiftId').isUUID(),
    param('workshiftMemberId').isUUID(),
    validatePayload()
]

const getWorkshiftMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const workshift = await client.workshift.findUnique({ where: { id: req.params.workshiftId } })
        if (!workshift) throw new NoContentError('Workshift not found')

        const workshiftMember = await client.workshiftMember.findUnique({
            where: { id: req.params.workshiftMemberId }
        })

        if (!workshiftMember) throw new NoContentError('Workshift member not found')

        res.json(response('success', { workshiftMember }))
    }
}

export default getWorkshiftMember