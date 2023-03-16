import { Session, User } from '@prisma/client';
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma';
import { Access } from '../../lib/access';
import { createSetupVariabe, createUser, createUserSession, setup } from '../setup'


const setupVar = createSetupVariabe()

describe('DELETE /users/:userId', () => {
    beforeEach(async () => {
        await setup(setupVar)
    })

    afterEach(async () => {
        await client.user.deleteMany({})
    })

    it('should return status code 401 for Role None', async () => {
        const response = await supertest(app)
            .delete(`/users/${setupVar.user1.id}`)

        const deleted = await client.user.findUnique({
            where: { id: setupVar.user1.id }
        })

        expect(response.statusCode).toBe(401)
        expect(deleted).toBeDefined()
    })

    it('should return status code 200 for User deleting themselves', async () => {
        const response = await supertest(app)
            .delete(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

        const deleted = await client.user.findUnique({
            where: { id: setupVar.user1.id }
        })

        expect(response.statusCode).toBe(200)
        expect(deleted).toBeNull()
    })

    it('should return status code 403 for User deleting another user', async () => {
        const response = await supertest(app)
            .delete(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.user2.session.token}`)


        const deleted = await client.user.findUnique({
            where: { id: setupVar.user1.id }
        })

        expect(response.statusCode).toBe(403)
        expect(deleted).toBeDefined()
    })

    it('should return status code 404 for Admin deleting non-existent User', async () => {
        const response = await supertest(app)
            .delete(`/users/999`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .expect(404)

        const deleted = await client.user.findUnique({
            where: { id: '999' }
        })

        expect(response.statusCode).toBe(404)
        expect(deleted).toBeNull()
    })

    it('should return status code 200 for Admin deleting User', async () => {
        const response = await supertest(app)
            .delete(`/users/${setupVar.user1.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

        const deleted = await client.user.findUnique({
            where: { id: setupVar.user1.id }
        })

        expect(response.statusCode).toBe(200)
        expect(deleted).toBeNull()
    })
})
