import { User, UserRole } from '@prisma/client'
import { RequestHandler } from 'express'
import { body } from 'express-validator'
import client from '../../config/prisma'
import ConflictError from '../../errors/ConflictError'
import response from '../../lib/response'
import userRole from '../../middlewares/auth/userAuth'
import validatePayload from '../../middlewares/validatePayload'
import verifyToken from '../../middlewares/verifyToken'

interface IParams { }
interface IBody extends Omit<User, 'id'> { }
interface IQuery { }

export const validateCreateUser = [
    verifyToken(),
    userRole('ADMIN'),
    body('name').notEmpty(),
    body('phone').notEmpty().isMobilePhone('id-ID'),
    body('role').optional().isIn(Object.values(UserRole)),
    validatePayload()
]

const createUser = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const { name, phone, role } = req.body
        const userExist = await client.user.findUnique({ where: { phone } })
        if (userExist) throw new ConflictError('Phone number already used')

        const user = await client.user.create({
            data: {
                name,
                phone,
                role
            }
        })

        res.status(201).json(response('success', { user }))
    }
}

export default createUser