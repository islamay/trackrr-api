import { Attendance, Company, CompanyMember, MemberRole, Workshift, WorkshiftMember } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createAttendance, createCompany, createMember, createSetupVariabe, createWorkshift, createWorkshiftMember, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift
let workshiftMember1: WorkshiftMember
let workshiftMember2: WorkshiftMember

describe('GET /company/:companyId/workshifts/:workshiftId/attendances', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('Pt. Mukhlis Jaya Abadi Sentosa')
        workshift = await createWorkshift({
            companyId: company.id,
            name: 'pagi',
            workingStart: '08:00:00',
            workingEnd: '17:00:00'
        })
        const member1 = await createMember(setupVar.user1.id, company.id)
        const member2 = await createMember(setupVar.user2.id, company.id)
        workshiftMember1 = await createWorkshiftMember(workshift.id, member1.id)
        workshiftMember2 = await createWorkshiftMember(workshift.id, member2.id)
    })

    afterEach(async () => {
        await client.attendance.deleteMany({})
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    describe('Workshift member cases', () => {

        test('create attendance for themself', async () => {
            const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/attendances`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ workshiftMemberId: workshiftMember1.id })

            expect(res.statusCode).toBe(201)
        })

        it('should not create 2 attendance for same user in day', async () => {
            await createAttendance(workshift.id, workshiftMember1.id)
            const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/attendances`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ workshiftMemberId: workshiftMember1.id })

            expect(res.statusCode).toBe(409)
        })

        it('should not create attendance for user creating another user attendance', async () => {
            const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/attendances`)
                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                .send({ workshiftMemberId: workshiftMember2.id })

            expect(res.statusCode).toBe(403)
        })
    })

    describe('Non workshift member', () => {
        it('should not create attendance for Non workshift member (even admin)', async () => {
            const res = await supertest(app).post(`/company/${company.id}/workshifts/${workshift.id}/attendances`)
                .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                .send({ workshiftMemberId: workshiftMember1.id })

            expect(res.statusCode).toBe(403)
        })
    })

})