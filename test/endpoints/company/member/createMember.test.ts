import { Company } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createSetupVariabe, setup } from '../../setup'

const setupVar = createSetupVariabe()
let company: Company

describe('POST /company', () => {
    beforeAll(async () => {
        await setup(setupVar)
        const res = await supertest(app).post('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ name: 'PT. Mukhlis' })

        company = res.body.body.company
    })

    afterEach(async () => {
        await client.companyMember.deleteMany({})
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    describe('Fail case', () => {
        it('should fail for token not provided', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
            expect(res.statusCode).toBe(401)
        })

        it('should fail if request body uncomplete', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

            expect(res.statusCode).toBe(400)
        })

        it('should fail when creating member that already a member', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1.id, role: 'MEMBER' })

            const res2 = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1.id, role: 'MEMBER' })

            expect(res.statusCode).toBe(201)
            expect(res2.statusCode).toBe(409)
        })
    })

    describe('User Role : Admin', () => {
        afterEach(async () => {
            await client.companyMember.deleteMany({})
        })

        it('should success for admin create owner', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1.id, role: 'OWNER' })
            expect(res.statusCode).toBe(201)
        })

        it('should success for admin create operator', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1.id, role: 'OPERATOR' })
            expect(res.statusCode).toBe(201)
        })


        it('should success for admin create member', async () => {
            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1.id, role: 'MEMBER' })
            expect(res.statusCode).toBe(201)
        })
    })



    describe('User Role : User', () => {
        afterEach(async () => {
            await client.companyMember.deleteMany()
        })

        it('should fail for owner create member', async () => {
            // * make user1 an owner
            await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1, role: 'OWNER' })

            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ userId: setupVar.user2.id })
            expect(res.statusCode).toBe(403)
        })

        it('should fail for operator create member', async () => {
            // * make user1 an operator
            await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1, role: 'OPERATOR' })

            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ userId: setupVar.user2.id })
            expect(res.statusCode).toBe(403)
        })

        it('should fail for member create member', async () => {
            // * make user1 a member
            await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ userId: setupVar.user1 })

            const res = await supertest(app).post(`/company/${company.id}/members`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ userId: setupVar.user2.id })
            expect(res.statusCode).toBe(403)
        })
    })
})
