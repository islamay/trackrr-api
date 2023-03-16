import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma'
import { createSetupVariabe, setup } from '../setup'

const setupVar = createSetupVariabe()

describe('POST /company', () => {
    beforeAll(async () => {
        await setup(setupVar)
    })
    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    it('should fail for token not provided', async () => {
        const res = await supertest(app).get('/company')
        expect(res.statusCode).toBe(401)
    })

    it('should fail if role is user', async () => {
        const res = await supertest(app).get('/company')
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

        expect(res.statusCode).toBe(403)
    })

    it('should success', async () => {
        const res = await supertest(app).get('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

        expect(res.statusCode).toBe(200)
    })
})
