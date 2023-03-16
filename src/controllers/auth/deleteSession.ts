import { RequestHandler } from 'express'
import client from '../../config/prisma'
import response from '../../lib/response'
import userAuth, { IBodyAfterUserAuth } from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams { }
interface IBody extends IBodyAfterUserAuth { }
interface IQuery { }

export const validateDeleteSession = [
    verifyToken(),
    userAuth(),
]

const deleteSession = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const session = await client.session.delete({
            where: { id: req.body.session.id }
        })

        res.json(response('success', { session }))
    }
}

export default deleteSession