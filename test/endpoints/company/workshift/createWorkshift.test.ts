import { Company, CompanyMember, MemberRole } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, setup } from '../../setup'

const setupVar = createSetupVariabe()
let company: Company

describe('POST /company/:companyId/workshifts', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT. Mukhlis Jaya Abadi')
    })
    afterEach(async () => {
        await client.companyMember.deleteMany()
        await client.workshift.deleteMany()
    })
    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    const roles = Object.values(MemberRole)
    describe('Company member cases', () => {
        for (const role of roles) {
            const statusCode = role === 'MEMBER' ? 403 : 201
            const shouldOrNot = role === 'MEMBER' ? 'should' : 'should not'
            it(`${shouldOrNot} create workshift for role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).post(`/company/${company.id}/workshifts`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                    .send({
                        name: 'PT Mukhlis Jaya Abadi',
                        workingStart: '08:00:00',
                        workingEnd: '17:00:00'
                    })
                expect(res.statusCode).toBe(statusCode)
            })
        }
    })

    describe('Invalid parameter', () => {
        for (const role of roles) {
            if (role !== 'MEMBER') {
                it(`should not create workshift for role ${role} with invalid body`, async () => {
                    await createMember(setupVar.user1.id, company.id, role)
                    const res = await supertest(app).post(`/company/${company.id}/workshifts`)
                        .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

                    expect(res.statusCode).toBe(400)
                })
            }
        }
    })

    it('should create workshift for role admin', async () => {
        const res = await supertest(app).post(`/company/${company.id}/workshifts`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({
                name: 'PT Mukhlis Jaya Abadi',
                workingStart: '08:00:00',
                workingEnd: '17:00:00'
            })

        expect(res.statusCode).toBe(201)
    })

    it('should not create workshift for non member and admin', async () => {
        const res = await supertest(app).post(`/company/${company.id}/workshifts`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

        expect(res.statusCode).toBe(403)
    })
})