import casual from 'casual'
import { Company, CompanyMember, MemberRole, Workshift, WorkshiftMember } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, createWorkshift, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift
let member: CompanyMember

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
            const success = role !== 'MEMBER'
            const shouldOrNot = success ? 'should' : 'should not'
            const expected = success ? 201 : 403
            it(`${shouldOrNot} create workshift member for member role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/members`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                    .send({ companyMemberId: member.id })
                expect(res.statusCode).toBe(expected)
            })
        }
    })

    describe('Invalid parameter cases', () => {
        const cases = [
            { body: {}, reason: 'member id not assigned', expected: 400 },
            { body: { companyMemberId: 'abc' }, reason: 'member id not valid', expected: 400 },
            { body: { companyMemberId: casual.uuid }, reason: 'member not exist', expected: 404 },
        ]

        for (const useCase of cases) {
            it(`should not create workshift member for ${useCase.reason}`, async () => {
                const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/members`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                    .send(useCase.body)
                expect(res.statusCode).toBe(useCase.expected)
            })
        }
    })

    it('should create workshift member for role admin', async () => {
        const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/members`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ companyMemberId: member.id })


        expect(res.statusCode).toBe(201)
    })

    it('should not create workshift member for non-company-member', async () => {
        const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/members`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
            .send({ companyMemberId: member.id })
        expect(res.statusCode).toBe(403)
    })
})