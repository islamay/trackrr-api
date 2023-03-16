import { Invitation, User } from '@prisma/client'
import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../config/prisma'
import ForbiddenError from '../../errors/ForbiddenError'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import userAuth, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    invitationId: string
}
interface IBody extends IBodyAfterUserAuth { }
interface IQuery { }

export const validateDeleteInvitation = [
    verifyToken(),
    userAuth(),
    param('invitationId').notEmpty()
]

const checkIsSender = (user: User, invitation: Invitation) => {
    if (user.id !== invitation.senderId && user.role !== 'ADMIN')
        throw new ForbiddenError('Forbidden')
}

const deleteInvitation = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const invitation = await client.invitation.findUnique({
            where: { id: req.params.invitationId }
        })

        if (!invitation) throw new NoContentError('Invitation not found')
        checkIsSender(req.body.session.user, invitation)

        await client.invitation.delete({
            where: { id: req.params.invitationId }
        })

        res.json(response('success', { invitation }))
    }
}

export default deleteInvitation