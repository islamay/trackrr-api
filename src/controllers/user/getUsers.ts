import { RequestHandler } from 'express'
import client from '../../config/prisma'
import response from '../../lib/response'
import userRole from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams { }
interface IBody { }
interface IQuery { }

export const validateGetUsers = [
    verifyToken(),
    userRole('ADMIN'),
]

const getUsers = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const users = await client.user.findMany()
        res.json(response('success', { users }))
    }
}

export default getUsers