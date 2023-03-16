import { Company } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../src/app'
import client from '../../../src/config/prisma'
import { createSetupVariabe, setup } from '../setup'

const setupVar = createSetupVariabe()
let company: Company

describe('DELETE /company', () => {
    beforeAll(async () => {
        await setup(setupVar)
    })

    afterAll(async () => {
        await client.user.deleteMany()
    })

    beforeEach(async () => {
        const res = await supertest(app).post('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ name: 'PT. Mukhlis' })

        company = res.body.body.company
    })

    afterEach(async () => {
        await client.company.deleteMany()
    })

    it('should success for admin deleting company', async () => {
        const res = await supertest(app).delete(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should fail for company not found', async () => {
        const res = await supertest(app).delete(`/company/abc`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(404)
    })

    it('should error for owner deleting company', async () => {
        // * make user1 owner
        await supertest(app).post(`company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ userId: setupVar.user1.id, role: 'OWNER' })

        const res = await supertest(app).delete(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    it('should error for operator deleting company', async () => {
        // * make user1 operator
        await supertest(app).post(`company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ userId: setupVar.user1.id, role: 'OPERATOR' })

        const res = await supertest(app).delete(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    it('should error for member deleting company', async () => {
        const res = await supertest(app).delete(`/company/${company.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    it('should error for token not provided', async () => {
        const res = await supertest(app).delete(`/company/${company.id}`)

        expect(res.statusCode).toBe(401)
    })

})