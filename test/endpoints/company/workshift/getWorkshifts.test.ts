import { Company, CompanyMember, MemberRole } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, setup } from '../../setup'


const setupVar = createSetupVariabe()
let company: Company

describe('GET company/:companyId/workshifts', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT. Mukhlis MD')
    })

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })

    afterAll(async () => {
        await client.company.deleteMany({})
        await client.$disconnect()
    })

    describe('Company member cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            it(`should get all workshift for ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).get(`/company/${company.id}/workshifts`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(200)
            })
        }
    })

    it('should get all workshift for admin', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

        expect(res.statusCode).toBe(200)
    })


    it('should not get all workshift for non member', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

        expect(res.statusCode).toBe(403)
    })

})