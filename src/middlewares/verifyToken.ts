import { RequestHandler } from 'express'
import ValidationError from '../errors/ValidationError'
import jwt from 'jsonwebtoken'
import { secretKey } from '../config/env'
import AuthorizationError from '../errors/AuthorizationError'
import { instanceOfTokenPayload, TokenPayload } from '../lib/generateToken'

export interface IBodyAfterVerifyToken {
    token: string
    decoded: TokenPayload
}

interface IParams { }
interface IBody extends IBodyAfterVerifyToken { }
interface IQuery { }

const verifyToken = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res, next) => {
        const bearerToken = req.headers.authorization || ''
        if (!bearerToken) throw new AuthorizationError('Unauthenticated')

        const token = bearerToken.replace(/^Bearer /, '')
        try {
            const decoded = jwt.verify(token, secretKey)

            if (typeof decoded !== 'object') throw new AuthorizationError('Unauthenticated')
            if (!instanceOfTokenPayload(decoded)) throw new AuthorizationError('Unauthenticated')

            req.body.token = token
            req.body.decoded = decoded
            next()
        } catch (error) {

            throw new AuthorizationError('Unauthenticated')
        }
    }
}

export default verifyToken