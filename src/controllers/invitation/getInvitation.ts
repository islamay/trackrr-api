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

export const validateGetInvitation = [
    verifyToken(),
    userAuth()
]

const getInvitation = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const invitation = await client.invitation.findUnique({
            where: { id: req.params.invitationId }
        })

        if (!invitation) throw new NoContentError('Invitation not found')
        if (req.body.session.user.id !== invitation.receiverId ||
            req.body.session.user.id !== invitation.senderId)
            throw new ForbiddenError('Forbidden')

        res.json(response('success', { invitation }))
    }
}

export default getInvitation