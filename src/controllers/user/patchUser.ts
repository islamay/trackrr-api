import { User, UserRole } from '@prisma/client'
import { RequestHandler } from 'express'
import { body, param } from 'express-validator'
import client from '../../config/prisma'
import ConflictError from '../../errors/ConflictError'
import ForbiddenError from '../../errors/ForbiddenError'
import NoContentError from '../../errors/NoContentError'
import phoneFormatter from '../../lib/phoneFormatter'
import response from '../../lib/response'
import authUser, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import validatePayload from '../../middlewares/validatePayload'
import verifyToken from '../../middlewares/verifyToken'

interface IParams {
    userId: string
}
interface IBody extends Partial<User>, IBodyAfterUserAuth { }
interface IQuery { }

export const validatePatchUser = [
    verifyToken(),
    authUser(),
    param('userId')
        .notEmpty(),
    body('role')
        .optional()
        .isIn(Object.values(UserRole)),
    body('phone')
        .optional()
        .isMobilePhone('id-ID'),
    validatePayload()
]

const patchUser = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { name, phone, role, session } = req.body
        const user = await client.user.findUnique({ where: { id: req.params.userId } })

        if (!user) throw new NoContentError('User not found')
        if (!isTheUserItself(session.user, req.params.userId)) throw new ForbiddenError('Forbidden')
        if (role && !isAuthorizedToUpdateRole(user)) throw new ForbiddenError('Forbidden')
        if (phone && !isPhoneNumberAvailable(phone)) throw new ConflictError('Phone number already used')

        const updatedField = Object.assign({}, { name, phone, role })
        const updated = await client.user.update({
            where: { id: req.params.userId },
            data: updatedField
        })

        res.json(response('success', { user: updated }))
    }
}


const isTheUserItself = (user: User, requestedUserId: string) => {
    if (user.id === requestedUserId || user.role === 'ADMIN') return true
    return false
}

const isAuthorizedToUpdateRole = (user: User) => {
    if (user.role === 'ADMIN') return true
    return false
}

const isPhoneNumberAvailable = async (phone: string) => {
    const isExist = await client.user.findFirst({
        where: { phone: phoneFormatter(phone) as string }
    })
    return !!isExist
}

export default patchUser