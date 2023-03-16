import { Router } from 'express'
import createSession, { validateCreateSession } from '../controllers/auth/createSession'
import getSession, { validateGetSession } from '../controllers/auth/getSession'
import createOtp, { otpValidation } from '../controllers/auth/createOtp'
import deleteSession, { validateDeleteSession } from '../controllers/auth/deleteSession'

const createAuthRouter = () => {
    const router = Router()

    router.post('/otp', otpValidation, createOtp())
    router.post('/session', validateCreateSession, createSession())
    router.get('/session/:sessionId', validateGetSession, getSession())
    router.delete('/session/:sessionId', validateDeleteSession, deleteSession())

    return router
}

export default createAuthRouter