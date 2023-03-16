import { Session, User } from '@prisma/client';
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma';
import { createSetupVariabe, createUser, createUserSession, setup } from '../setup'


const setupVar = createSetupVariabe()

describe('Test POST /user Endpoint', () => {
    beforeEach(async () => {
        await setup(setupVar)
    })

    afterEach(async () => {
        await client.user.deleteMany({})
    })

    const tests = [
        {
            name: 'Should fail because: unauthenticated',
            body: {},
            expect: 401,
            access: 'GUEST'
        },
        {
            name: 'Should fail because: role is user',
            body: {},
            expect: 403,
            access: 'USER'
        },
        {
            name: 'Should fail because: body is not valid',
            body: {},
            expect: 400,
            access: 'ADMIN'
        },
        {
            name: 'Should create new user',
            body: {
                name: 'Dean Prayoga',
                phone: '+6282129786006'
            },
            expect: 201,
            access: 'ADMIN'
        }
    ]

    for (const test of tests) {
        it(test.name, async () => {
            const token = test.access === 'ADMIN' ? setupVar.admin.session.token : test.access === 'USER' ? setupVar.user1.session.token : ''
            const res = await supertest(app).post('/users')
                .set('Authorization', `Bearer ${token}`)
                .send(test.body)


            expect(res.statusCode).toBe(test.expect)
        })

    }
})