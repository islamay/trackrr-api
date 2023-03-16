import casual from 'casual'
import { Company, CompanyMember, MemberRole, Workshift } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, createWorkshift, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift

describe('GET /company/:companyId/workshifts/:workshiftId/members', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT. Mukhlis Jaya Abadi')
        workshift = await createWorkshift({
            companyId: company.id,
            name: 'siang',
            workingStart: '00:00:00',
            workingEnd: '00:00:00',
        })
    })

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    describe('Company member cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            it(`should get all members from workspace for member role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(200)
            })
        }
    })

    describe('Invalid parameter cases', () => {
        const cases: { workshiftId: string, expected: number, reason: string }[] = [
            { workshiftId: 'abc', expected: 400, reason: 'invalid id' },
            { workshiftId: casual.uuid, expected: 404, reason: 'not exist workshift' }
        ]

        for (const useCase of cases) {
            it(`should not get all members of workspace for ${useCase.reason}`, async () => {
                const res = await supertest(app).get(`/company/${company.id}/workshifts/${useCase.workshiftId}/members`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                expect(res.statusCode).toBe(useCase.expected)
            })
        }
    })

    it(`should get all members from workspace for admin`, async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it(`should not get all members from workspace for non-company-member`, async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })
})