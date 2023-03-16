import { RequestHandler } from 'express'
import { param } from 'express-validator'
import client from '../../config/prisma'
import ForbiddenError from '../../errors/ForbiddenError'
import NoContentError from '../../errors/NoContentError'
import response from '../../lib/response'
import userRole, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import validatePayload from '../../middlewares/validatePayload'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    userId: string
}
interface IBody { }
interface IQuery { }

export const validateGetUser = [
    verifyToken(),
    userRole(),
    param('userId')
        .notEmpty()
        .custom((i, m) => {
            if (
                i !== (m.req.body as IBodyAfterUserAuth).decoded.userId &&
                (m.req.body as IBodyAfterUserAuth).session.user.role !== 'ADMIN'
            ) {
                m.req.body.error = new ForbiddenError('Forbidden')
                return false
            }

            return true
        }),
    validatePayload(),
]

const getUser = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const user = await client.user.findUnique({
            where: { id: req.params.userId },
            include: {
                companies: {
                    include: { workshifts: true }
                }
            }
        })
        if (!user) throw new NoContentError('User not found')
        res.json(response('success', { user }))
    }
}

export default getUser