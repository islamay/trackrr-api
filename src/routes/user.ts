import { Router } from 'express'
import createUser, { validateCreateUser } from '../controllers/user/createUser'
import deleteUser, { validateDeleteUser } from '../controllers/user/deleteUser'
import getUser, { validateGetUser } from '../controllers/user/getUser'
import getUsers, { validateGetUsers } from '../controllers/user/getUsers'
import patchUser, { validatePatchUser } from '../controllers/user/patchUser'

const createUserRouter = () => {
    const router = Router()

    router.get('/', validateGetUsers, getUsers())
    router.post('/', validateCreateUser, createUser())
    router.get('/:userId', validateGetUser, getUser())
    router.patch('/:userId', validatePatchUser, patchUser())
    router.delete('/:userId', validateDeleteUser, deleteUser())

    return router
}

export default createUserRouter