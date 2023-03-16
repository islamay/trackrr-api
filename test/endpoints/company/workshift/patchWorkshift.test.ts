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
            workingStart: '07:00:00',
            workingEnd: '17:00:00'
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
            const success = role !== 'MEMBER'
            const shouldOrNot = success ? 'should' : 'should not'
            const expected = success ? 200 : 403
            it(`${shouldOrNot} able to update workshift for role ${role}`, async () => {
                const member = await createMember(setupVar.user1.id, company.id, MemberRole[role])
                const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

                console.log(member);

                expect(member.role).toBe(role)
                expect(res.statusCode).toBe(expected)
            })
        }
    })

    describe('invalid parameter cases', () => {
        const invalidBodies: Partial<Workshift>[] = [
            // @ts-ignore
            { name: false },
            { workingEnd: 'aa' },
            { workingStart: 'bb' },
        ]

        for (const invalidBody of invalidBodies) {
            it('should not able to update workshift with invalid parameter', async () => {
                const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                    .send(invalidBody)
                expect(res.statusCode).toBe(400)
            })
        }
    })

    it('should able to update workshift for admin', async () => {
        const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should not able to update workshift for non member', async () => {
        const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

})