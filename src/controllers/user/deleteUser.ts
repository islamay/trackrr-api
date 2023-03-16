import { User } from '@prisma/client'
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

export const validateDeleteUser = [
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

const deleteUser = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {

        const user = await client.user.findUnique({ where: { id: req.params.userId } })
        if (!user) throw new NoContentError('User not found')

        await client.user.delete({ where: { id: req.params.userId } })
        res.json(response('success', { user }))
    }
}

export default deleteUser