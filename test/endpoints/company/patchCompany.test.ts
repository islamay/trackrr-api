import { Company } from '@prisma/client'
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma'
import { createSetupVariabe, setup } from '../setup'

const setupVar = createSetupVariabe()
let company: Company

describe('POST /company', () => {
    beforeAll(async () => {
        await setup(setupVar)
        const res = await supertest(app).post('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ name: 'Japone' })

        company = res.body.body.company

        await supertest(app).post(`/company/${company.id}/member`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
    })
    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    it('should fail for token not provided', async () => {
        const res = await supertest(app).patch(`/company/${company.id}`)
        expect(res.statusCode).toBe(401)
    })

    it('should fail for role is member', async () => {
        const res = await supertest(app).patch(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

        expect(res.statusCode).toBe(403)
    })

    it('should fail for role is operator', async () => {
        const res = await supertest(app).patch(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

        expect(res.statusCode).toBe(200)
    })

    it('should update current company', async () => {
        const res = await supertest(app).patch(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

        expect(res.statusCode).toBe(200)
    })
})
