import { Invitation, InvitationState, User } from '@prisma/client'
import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../config/prisma'
import ForbiddenError from '../../errors/ForbiddenError'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import userAuth, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    invitationId: string
}
interface IBody extends IBodyAfterUserAuth {
    readed: boolean,
}
interface IQuery { }

export const validatePatchInvitation = [
    verifyToken(),
    userAuth(),
    body('readed')
        .optional()
        .isBoolean()
]

const checkIsReceiver = (user: User, invitation: Invitation) => {
    if (user.id !== invitation.receiverId && user.role !== 'ADMIN')
        throw new ForbiddenError('Forbidden')
}

const patchInvitation = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { readed } = req.body
        const invitation = await client.invitation.findUnique({
            where: { id: req.params.invitationId }
        })
        if (!invitation) throw new NoContentError('Invitation not found')
        if (readed) checkIsReceiver(req.body.session.user, invitation)

        const updatedField = Object.assign({}, { readed })
        const updated = await client.invitation.update({
            where: { id: invitation.id },
            data: updatedField
        })

        res.json(response('success', { invitation: updated }))
    }
}

export default patchInvitation