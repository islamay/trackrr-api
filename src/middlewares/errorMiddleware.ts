import { ErrorRequestHandler } from 'express'
import BaseError from '../errors/BaseError'
import ServerError from '../errors/ServerError'

interface IParams { }
interface IBody { }
interface IQuery { }

const errorMiddleware = (): ErrorRequestHandler<IParams, {}, IBody, IQuery> => {
    return async (error, req, res, next) => {
        if (error instanceof BaseError) {
            return res.status(error.errorCode).json(error.serializeError())
        } else {
            const serverError = new ServerError('Server Error')
            return res.status(serverError.errorCode).json(serverError.serializeError())
        }
    }
}

export default errorMiddleware

