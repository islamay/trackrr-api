import casual from 'casual'
import { Company, CompanyMember, MemberRole, Workshift } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createCompany, createMember, createSetupVariabe, createWorkshift, setup } from '../../setup'


const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift

describe('GET company/:companyId/workshifts', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT. Mukhlis Jaya Abadi')
        workshift = await createWorkshift({
            companyId: company.id,
            name: 'Siang',
            workingStart: '07:00:00',
            workingEnd: '17:00:00'
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
            it(`should get workshift from company for member role ${role}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(200)
            })
        }
    })

    describe('Invalid parameter cases', () => {
        it('should not get workshift for workshiftId invalid', async () => {
            const res = await supertest(app).get(`/company/${company.id}/workshifts/abc`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            expect(res.statusCode).toBe(400)
        })

        it('should not get workshift for workshift not exist', async () => {

            const res = await supertest(app).get(`/company/${company.id}/workshifts/${casual.uuid}`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            expect(res.statusCode).toBe(404)
        })
    })

    it('should get workshift from all company for admin', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should not get workshift from company for non-member', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}`)
            .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
        expect(res.statusCode).toBe(403)
    })

}) 