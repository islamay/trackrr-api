import { Company } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createSetupVariabe, setup } from '../../setup'

const setupVar = createSetupVariabe()
let company: Company

describe('GET /company/:companyId/members', () => {
    beforeAll(async () => {
        await setup(setupVar)
        const res = await supertest(app).post('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ name: 'PT. Mukhlis' })

        company = res.body.body.company
    })

    afterAll(async () => {
        await client.company.deleteMany()
    })

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })


    it('should get all members for role admin', async () => {
        const res = await supertest(app).get(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should get all members for member role owner', async () => {
        await supertest(app).post(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ userId: setupVar.user1.id, role: 'OWNER' })

        const res = await supertest(app).get(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should get all members for member role operator', async () => {
        await supertest(app).post(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ userId: setupVar.user1.id, role: 'OPERATOR' })

        const res = await supertest(app).get(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should get all members for member role member', async () => {
        await supertest(app).post(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ userId: setupVar.user1.id })

        const res = await supertest(app).get(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should error for not a member', async () => {
        const res = await supertest(app).get(`/company/${company.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    it('should error for not a user', async () => {
        const res = await supertest(app).get(`/company/${company.id}/members`)
        expect(res.statusCode).toBe(401)
    })


})