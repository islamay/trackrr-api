import { Request, Response, NextFunction } from 'express'
import client from '../config/prisma'
import NoContentError from '../errors/NoContentError'
import ValidationError from '../errors/ValidationError'
import phoneFormatter from '../lib/phoneFormatter'
import { User } from 'prisma/prisma-client'

export interface IBodyAfterValidatePhone {
    user: User
}

const validatePhone = (checkUser?: boolean) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const phone = req.body.phone || ''
        if (typeof phone !== 'string') throw new ValidationError('Phone number invalid')

        const formattedPhone = phoneFormatter(phone)
        if (!formattedPhone) throw new ValidationError('Phone number invalid')

        req.body.phone = formattedPhone
        if (!checkUser) return next()

        const user = await client.user.findUnique({
            where: { phone: formattedPhone }
        })

        if (!user) throw new NoContentError('Phone number not registered')

        req.body.user = user
        next()
    }
}

export default validatePhone