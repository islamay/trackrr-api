import { RequestHandler } from 'express'
import { MemberRole, UserRole, Session, User, CompanyMember } from '@prisma/client'
import { IBodyAfterVerifyToken } from '../verifyToken'
import client from '../../config/prisma'
import AuthorizationError from '../../errors/AuthorizationError'
import ForbiddenError from '../../errors/ForbiddenError'

export interface IBodyAfterMemberRole extends IBodyAfterVerifyToken {
    session: Session & { user: User & { companies: CompanyMember[] } }
    membership: CompanyMember
}

interface IParams { }
interface IBody extends IBodyAfterMemberRole { }
interface IQuery { }

const companyMemberAuth = (id: string, roles?: MemberRole[]): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res, next) => {
        const session = await client.session.findFirst({
            where: { userId: req.body.decoded.userId, token: req.body.token },
            include: { user: { include: { companies: true } } }
        })

        if (!session) throw new AuthorizationError('Unauthorized')
        req.body.session = session;

        if (session.user.role === UserRole.ADMIN) return next()

        const thisMember = session.user.companies.find((c) => c.companyId === req.params[id as keyof IParams])
        if (!thisMember) throw new ForbiddenError('Forbidden')

        req.body.membership = thisMember

        if (!roles) return next()
        if (roles.some(role => role === thisMember.role)) return next()

        throw new ForbiddenError('Forbidden')
    }
}

export default companyMemberAuth