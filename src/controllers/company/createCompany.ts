import { RequestHandler } from 'express'
import response from '../../lib/response'
import { body } from 'express-validator'
import client from '../../config/prisma'
import verifyToken, { IBodyAfterVerifyToken } from '../../middlewares/verifyToken'
import validatePayload from '../../middlewares/validatePayload'
import userAuth from '../../middlewares/auth/userAuth'
import { UserRole } from '@prisma/client'

interface IParams { }
interface IBody extends IBodyAfterVerifyToken {
    name: string,
}
interface IQuery { }

export const validateCreateCompany = [
    verifyToken(),
    userAuth(UserRole.ADMIN),
    body('name').notEmpty().isString(),
    validatePayload(),
]

const createCompany = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async ({ body: { name, decoded } }, res) => {
        const company = await client.company.create({
            data: { name }
        })
        res.status(201).json(response('success', { company }))
    }
}

export default createCompany