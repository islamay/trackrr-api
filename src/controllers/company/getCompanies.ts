import { RequestHandler } from 'express'
import client from '../../config/prisma'
import response from '../../lib/response'
import userAuth from '../../middlewares/auth/userAuth'
import verifyToken from '../../middlewares/verifyToken'

interface IParams { }
interface IBody { }
interface IQuery { }

export const validateGetCompanies = [
    verifyToken(),
    userAuth('ADMIN')
]

const getCompanies = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {
        const companies = await client.company.findMany()
        res.json(response('success', { companies }))
    }
}

export default getCompanies