import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../config/prisma'
import response from '../../lib/response'
import threeDays from '../../lib/threeDays'
import memberRole, { IBodyAfterMemberRole } from '../../middlewares/auth/companyMemberAuth'
import validatePayload from '../../middlewares/validatePayload'
import verifyToken from '../../middlewares/verifyToken'

interface IParams { }
interface IBody extends IBodyAfterMemberRole {
    companyId: string
    receiverId: string
}
interface IQuery { }

export const validateCreateInvitation = [
    body('companyId').notEmpty(),
    body('receiverId').notEmpty(),
    validatePayload(),
    verifyToken(),
    memberRole('companyId', ['OWNER', 'OPERATOR'])
]

const createInvitation = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { receiverId, session, companyId } = req.body
        try {
            const invitation = await client.invitation.create({
                data: {
                    receiverId,
                    senderId: session.userId,
                    expiresIn: threeDays(),
                    companyId: companyId
                }
            })
            res.status(201).json(response('success', { invitation }))
        } catch (error) {
            console.log(error);

        }

    }
}

export default createInvitation