import { RequestHandler } from 'express'
import { body } from 'express-validator'
import AuthorizationError from '../../errors/AuthorizationError'
import response from '../../lib/response'
import verifyOTP from '../../lib/verifyOTP'
import validatePhone, { IBodyAfterValidatePhone } from '../../middlewares/validatePhone'
import { createSession as createSessionUtil } from '../../model/session/createSession'

interface IParams { }
interface IBody extends IBodyAfterValidatePhone {
    phone: string
    otp: string
}
interface IQuery { }

export const validateCreateSession = [
    body('phone').notEmpty().isMobilePhone('id-ID').bail(),
    validatePhone(true),
]

const createSession = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const result = await verifyOTP(req.body.user.phone, req.body.otp)
        if (!result) throw new AuthorizationError('Incorrect otp')

        const session = await createSessionUtil({ userId: req.body.user.id })
        res.status(201).json(response('success', { session }))
    }
}

export default createSession