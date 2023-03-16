import { Company, CompanyMember, MemberRole, Workshift } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, createWorkshift, setup } from '../../setup'


const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift

describe('PATCH /company/:companyId/workshifts/:workshiftId', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT Mukhlis Jaya Abadi')
    })

    beforeEach(async () => {
        workshift = await createWorkshift({
            companyId: company.id,
            name: 'siang',
            workingStart: '09:00:00',
            workingEnd: '09:00:00',
        })
    })

    afterEach(async () => {
        await client.workshift.deleteMany()
        await client.companyMember.deleteMany()
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    describe('Company member cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            const success = role === 'OWNER'
            const shouldOrNot = success ? 'should' : 'should not'
            const expected = success ? 200 : 403
            it(`${shouldOrNot} be able to delete workshift for role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(expected)
            })
        }
    })

    it('should be able to delete workshift for admin', async () => {
        const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should not be able to delete workshift for non member', async () => {
        const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })
})