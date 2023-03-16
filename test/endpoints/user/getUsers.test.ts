import { Session, User } from '@prisma/client';
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma';
import { Access } from '../../lib/access';
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
            name: 'Should fail because unauthenticated',
            expect: 401,
            access: Access.GUEST
        },
        {
            name: 'Should fail because role is user',
            expect: 403,
            access: Access.USER,
        },
        {
            name: 'Should get all user',
            expect: 200,
            access: Access.ADMIN
        }
    ]

    tests.forEach((t) => {
        it(t.name, async () => {
            const token = t.access === 'ADMIN' ? setupVar.admin.session.token : t.access === 'USER' ? setupVar.user1.session.token : ''
            const res = await supertest(app).get('/users')
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(t.expect)
        })
    })
})