import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import BaseError from '../errors/BaseError'
import ValidationError from '../errors/ValidationError'

const validatePayload = (): RequestHandler<any, any, any, any, any> => {
    return (req, res, next) => {
        const result = validationResult(req)


        if (result.isEmpty()) return next()

        if (req.body.error instanceof BaseError) {
            throw req.body.error
        }


        const error = result.array()[0]
        const msg = `${error.msg} at ${error.param}`
        throw new ValidationError(msg)
    }
}

export default validatePayload