import { Invitation, InvitationState, User } from '@prisma/client'
import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../config/prisma'
import ForbiddenError from '../../errors/ForbiddenError'
import GoneError from '../../errors/GoneError'
import NoContentError from '../../errors/NoContentError'
import ServerError from '../../errors/ServerError'
import response from '../../lib/response'
import { IBodyAfterVerifyToken } from '../../middlewares/verifyToken'

interface IParams {
    invitationId: string
}
interface IBody extends IBodyAfterVerifyToken {
    action: 'ACCEPT' | 'REJECT'
}
interface IQuery { }

export const validateInvitationAction = [
    body('action').notEmpty().isIn(Object.values([
        InvitationState.ACCEPTED,
        InvitationState.REJECTED
    ]))
]

const invitationAction = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { decoded, action } = req.body
        const invitation = await client.invitation.findUnique({ where: { id: req.params.invitationId } })

        if (!isInvitationExist(invitation)) throw new NoContentError('Invitation not found')
        if (!isReceiver(decoded.userId, invitation)) throw new ForbiddenError('Forbidden')
        if (isInvitationUsed(invitation)) throw new ForbiddenError('Forbidden')
        if (isInvitationExpired(invitation)) throw new GoneError('Invitation expired')

        const updated = req.body.action === 'ACCEPT'
            ? await acceptInvitation(decoded.userId, invitation)
            : await rejectInvitation(invitation)

        res.json(response('success', { invitation: updated }))
    }
}

const isInvitationExist = (invitation: Invitation | null): invitation is Invitation => {
    if (!invitation) return false
    return true
}

const isInvitationExpired = (invitation: Invitation) => {
    if (Date.now() > invitation.expiresIn.getTime()) return false
    return true
}

const isInvitationUsed = (invitation: Invitation) => {
    if (invitation.status !== 'PENDING') return false
    return true
}

const isReceiver = (userId: string, invitation: Invitation) => {
    if (invitation.receiverId !== userId) return false
    return true
}

const acceptInvitation = async (userId: string, invitation: Invitation) => {
    const updated = await client.$transaction(async () => {
        await client.companyMember.create({
            data: {
                companyId: updated.companyId,
                userId: updated.receiverId
            }
        })

        return await client.invitation.update({
            where: { id: invitation.id },
            data: { status: 'ACCEPTED' }
        })
    })

    return updated
}
const rejectInvitation = async (invitation: Invitation) => {
    const updated = await client.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationState.REJECTED }
    })

    return updated
}

export default invitationAction