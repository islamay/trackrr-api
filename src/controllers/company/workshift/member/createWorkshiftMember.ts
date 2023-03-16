import { RequestHandler } from 'express'
import { body, param } from 'express-validator'
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
interface IBody {
    companyMemberId: string
}
interface IQuery { }

export const validateCreateWorkshiftMember = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR']),
    param('workshiftId').isUUID(),
    body('companyMemberId').isUUID(),
    validatePayload(),
]

const createWorkshiftMember = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const workshift = await client.workshift.findUnique({ where: { id: req.params.workshiftId } })
        const companyMember = await client.companyMember.findUnique({ where: { id: req.body.companyMemberId } })

        if (!workshift) throw new NoContentError('Workshift not found')
        if (!companyMember) throw new NoContentError('Company member not found')

        const workshiftMember = await client.workshiftMember.create({
            data: {
                workshiftId: req.params.workshiftId,
                companyMemberId: req.body.companyMemberId,
            }
        })

        res.status(201).json(response('success', { workshiftMember }))
    }
}

export default createWorkshiftMember