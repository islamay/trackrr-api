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

    describe('Company member cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            const success = role !== 'MEMBER'
            const shouldOrNot = success ? 'should' : 'should not'
            const expected = success ? 200 : 403
            it(`${shouldOrNot} delete workshift member for member role ${role}`, async () => {

                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                const deletedMember = await client.workshiftMember.findUnique({
                    where: { id: workshiftMember.id }
                })

                expect(res.statusCode).toBe(expected)
                if (success) expect(deletedMember).toBe(null)
                else expect(deletedMember).toMatchObject(workshiftMember)
            })
        }
    })

    it('should dete workshift member for role admin', async () => {
        const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        const deletedMember = await client.workshiftMember.findUnique({
            where: { id: workshiftMember.id }
        })

        expect(res.statusCode).toBe(200)
        expect(deletedMember).toBe(null)
    })

    it('should not delete workshift member for non-company-member', async () => {
        const res = await supertest(app).delete(`/company/${company.id}/workshifts/${workshift.id}/members/${workshiftMember.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        const deletedMember = await client.workshiftMember.findUnique({
            where: { id: workshiftMember.id }
        })

        expect(res.statusCode).toBe(403)
        expect(deletedMember).toMatchObject(workshiftMember)
    })

})