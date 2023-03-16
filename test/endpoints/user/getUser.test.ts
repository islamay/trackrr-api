import { Session, User } from '@prisma/client';
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma';
import { Access } from '../../lib/access';
import { createSetupVariabe, createUser, createUserSession, setup } from '../setup'

const setupVar = createSetupVariabe()

describe('GET /users/:userId', () => {
    beforeEach(async () => {
        await setup(setupVar)
    })

    afterEach(async () => {
        await client.user.deleteMany({})
    })

    it('should return 401 if user is not authenticated', async () => {
        const res = await supertest(app).get(`/users/${setupVar.user1.id}`)
        expect(res.statusCode).toBe(401)
    })

    it('should return 403 if requester is not user itself', async () => {
        const res = await supertest(app)
            .get(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.user2.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    it('should return 404 if user is not found', async () => {
        const res = await supertest(app)
            .get(`/users/invalid-user-id`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(404)
    })

    it('should return the user if admin and user is found', async () => {
        const res = await supertest(app)
            .get(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should return the user itself if user is authenticated as the user', async () => {
        const res = await supertest(app)
            .get(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(200)
    })

})
