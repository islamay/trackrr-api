import casual from 'casual'
import { Company, CompanyMember, MemberRole, Workshift, WorkshiftMember } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, createWorkshift, createWorkshiftMember, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift
let member: CompanyMember
let workshiftMember: WorkshiftMember

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

    beforeEach(async () => {
        member = await createMember(setupVar.user2.id, company.id)
        workshiftMember = await createWorkshiftMember(workshift.id, member.id)
    })

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    describe('Company member use cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            it(`should get workshift member for role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

                expect(res.statusCode).toBe(200)
            })
        }
    })

    describe('Invalid parameter cases', () => {
        const useCases: { parameter: string, expected: number, reason: string }[] = [
            { parameter: 'abc', expected: 400, reason: 'invalid uuid' },
            { parameter: casual.uuid, expected: 404, reason: 'non existing workshift member' }
        ]

        for (const useCase of useCases) {
            it(`should not return user for ${useCase.reason}`, async () => {
                console.log(useCase.parameter);
                console.log(workshiftMember.id);

                const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members/${useCase.parameter}`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                expect(res.statusCode).toBe(useCase.expected)
            })
        }
    })

    it('should get workshift member for role admin', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should not get workshift member for non-company-member', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })
})