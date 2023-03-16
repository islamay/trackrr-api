import { Session, User } from '@prisma/client';
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma';
import { Access } from '../../lib/access';
import { createSetupVariabe, createUser, createUserSession, setup } from '../setup'

const setupVar = createSetupVariabe()

describe('Test PATCH /users/:userId Endpoint', () => {
    beforeAll(async () => {
        await setup(setupVar)
    })

    afterAll(async () => {
        await client.user.deleteMany({})
    })

    describe('A. No token provided', () => {
        it('should return Unauthorized', async () => {
            const response = await supertest(app).patch(`/users/${setupVar.user1.id}`).send({ name: 'new name' })
            expect(response.status).toBe(401)
        })
    })

    describe('B. User Token', () => {
        describe('when User query himself', () => {
            it('should return 200', async () => {
                const response = await supertest(app).patch(`/users/${setupVar.user1.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                    .send({ name: 'new name' })
                expect(response.status).toBe(200)
            })
        })

        describe('when User query others', () => {
            it('should return 403', async () => {
                const response = await supertest(app).patch(`/users/${setupVar.user2.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                    .send({ name: 'new name' })
                expect(response.status).toBe(403)
            })
        })
    })

    describe('C. Admin Token', () => {
        describe('when User not found', () => {
            it('should return 404', async () => {
                const response = await supertest(app).patch(`/users/non-existing-user-id`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                    .send({ name: 'new name' })
                expect(response.status).toBe(404)
            })
        })

        describe('when User found', () => {
            it('should return 200', async () => {
                const response = await supertest(app).patch(`/users/${setupVar.user1.id}`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                    .send({ name: 'new name' })
                expect(response.status).toBe(200)
            })
        })
    })
})
