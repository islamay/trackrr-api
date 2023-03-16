import { Session, User } from '@prisma/client'
import { RequestHandler, } from 'express'
import ForbiddenError from '../../errors/ForbiddenError'
import response from '../../lib/response'
import userAuth, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    sessionId: string
}
interface IBody extends IBodyAfterUserAuth { }
interface IQuery { }

export const validateGetSession = [
    verifyToken(),
    userAuth(),
]

const getSession = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const session: Session & { user?: User } = req.body.session
        delete session.user

        if (session.id !== req.params.sessionId) throw new ForbiddenError('Forbidden')
        res.json(response('success', { session }))
    }
}

export default getSession