import { Router } from 'express'
import createInvitation, { validateCreateInvitation } from '../controllers/invitation/createInvitation'
import deleteInvitation, { validateDeleteInvitation } from '../controllers/invitation/deleteInvitation'
import getInvitation, { validateGetInvitation } from '../controllers/invitation/getInvitation'
import getInvitations, { validateGetInvitations } from '../controllers/invitation/getInvitations'
import invitationAction, { validateInvitationAction } from '../controllers/invitation/invitationAction'
import patchInvitation, { validatePatchInvitation } from '../controllers/invitation/patchInvitation'

// TODO : Add each route a validator

const createInvitationRouter = () => {
    const router = Router()

    router.get('/', validateGetInvitations, getInvitations())
    router.post('/', validateCreateInvitation, createInvitation())
    router.get('/:invitationId', validateGetInvitation, getInvitation())
    router.patch('/:invitationId', validatePatchInvitation, patchInvitation())
    router.delete('/:invitationId', validateDeleteInvitation, deleteInvitation())
    router.post('/:invitationId/action', validateInvitationAction, invitationAction())

    return router
}

export default createInvitationRouter