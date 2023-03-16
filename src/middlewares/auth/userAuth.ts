import { RequestHandler } from 'express'
import { CompanyMember, Session, User, UserRole } from '@prisma/client'
import client from '../../config/prisma'
import { IBodyAfterVerifyToken } from '../verifyToken'
import AuthorizationError from '../../errors/AuthorizationError'
import ForbiddenError from '../../errors/ForbiddenError'

export interface IBodyAfterUserAuth extends IBodyAfterVerifyToken {
    session: Session & { user: User }
}

interface IParams { }
interface IBody extends IBodyAfterUserAuth { }
interface IQuery { }

const userAuth = (role?: UserRole): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res, next) => {
        const session = await client.session.findFirst({
            where: { userId: req.body.decoded.userId, token: req.body.token },
            include: { user: true }
        })

        if (!session) throw new AuthorizationError('Token is not valid')

        req.body.session = session
        if (!role) return next()
        if (session.user.role === UserRole.ADMIN) return next()
        if (session.user.role !== role) throw new ForbiddenError('Forbidden')
        return next()
    }
}

export default userAuth