import { RequestHandler } from 'express'
import { body, param } from 'express-validator'
import client from '../../../config/prisma'
import NoContentError from '../../../errors/NoContentError'
import { dateValidator } from '../../../lib/dateValidator'
import response from '../../../lib/response'
import companyMemberAuth, { IBodyAfterMemberRole } from '../../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../../middlewares/validatePayload'
import verifyToken from '../../../middlewares/verifyToken'

interface IParams {
    companyId: string
    workshiftId: string
}
interface IBody extends IBodyAfterMemberRole {
    name?: string
    workingStart?: string
    workingEnd?: string
}
interface IQuery { }

export const validatePatchWorkshift = [
    param('companyId').isUUID(),
    validatePayload(),
    verifyToken(),
    companyMemberAuth('companyId', ['OWNER', 'OPERATOR']),
    param('workshiftId').isUUID(),
    body('name').optional().isString(),
    body('workingStart').optional().isString()
        .custom(i => dateValidator(i)),
    body('workingEnd').optional().isString()
        .custom(i => dateValidator(i)),
    validatePayload()
]

const patchWorkshift = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { name, workingStart, workingEnd } = req.body
        const workshift = await client.workshift.findUnique({
            where: { id: req.params.workshiftId }
        })

        console.log(req.body.session.user.companies);


        if (!workshift) throw new NoContentError('Workshift not found')
        const updatedField = Object.assign({}, { name, workingStart, workingEnd })
        const updated = await client.workshift.update({
            where: { id: req.params.workshiftId },
            data: updatedField
        })

        res.json(response('success', { workshift: updated }))
    }
}

export default patchWorkshift