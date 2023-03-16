import jwt from 'jsonwebtoken'
import { secretKey } from '../config/env'

export interface TokenPayload {
    userId: string
    descriptor: 'TOKEN_PAYLOAD'
}

const generateToken = (payload: Omit<TokenPayload, 'descriptor'>) => {
    const token = jwt.sign({ ...payload, descriptor: 'TOKEN_PAYLOAD' }, secretKey, { expiresIn: '7 days' })

    return token
}

export const instanceOfTokenPayload = (object: any): object is TokenPayload => {
    return object.descriptor === 'TOKEN_PAYLOAD'
}

export default generateToken