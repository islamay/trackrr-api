import { RequestHandler } from 'express'

interface IParams { }
interface IBody { }
interface IQuery { }

const validateUserIdOrAdmin = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res) => {

    }
}

export default validateUserIdOrAdmin