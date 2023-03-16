import { RequestHandler, Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import AuthorizationError from '../../errors/AuthorizationError'
import phoneFormatter from '../../lib/phoneFormatter'
import response from '../../lib/response'
import sendOTP from '../../lib/sendOTP'
import validatePayload from '../../middlewares/validatePayload'
import validatePhone from '../../middlewares/validatePhone'
interface IParams { }
interface IBody {
    phone: string
}
interface IQuery { }

type RequestHandlerType = RequestHandler<IParams, {}, IBody, IQuery>

export const otpValidation = [
    body('phone').notEmpty().isMobilePhone('id-ID').bail(),
    validatePayload(),
    validatePhone(true)
]

const otp = (): RequestHandlerType => {
    return async ({ body: { phone } }, res) => {
        sendOTP(phone)
        res.json(response('success'))
    }
}

export default otp