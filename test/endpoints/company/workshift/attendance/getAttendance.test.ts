import { Attendance, Company, CompanyMember, MemberRole, Workshift } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createAttendance, createCompany, createMember, createSetupVariabe, createWorkshift, createWorkshiftMember, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift
let attendance: Attendance

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
        const member = await createMember(setupVar.user2.id, company.id)
        const workshiftMember = await createWorkshiftMember(workshift.id, member.id)
        attendance = await createAttendance(workshift.id, workshiftMember.id)
    })

    afterEach(async () => {
        await client.companyMember.deleteMany({
            where: { userId: setupVar.user1.id }
        })
    })

    afterAll(async () => {
        await client.user.deleteMany()
        await client.company.deleteMany()
    })

    const roles = Object.values(MemberRole)
    describe('Company member cases', () => {
        for (const role of roles) {
            const success = role !== 'MEMBER'
            const shouldOrNot = success ? 'should' : 'should not'
            const expected = success ? 200 : 403
            it(`${shouldOrNot} get attendance for role ${expected}`, async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(expected)
            })

        }

        it('should get attendance for creator', async () => {
            const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${setupVar.user2.session.token}`)
            expect(res.statusCode).toBe(200)
        })
    })

    it('should get attendance for admin', async () => {
        const res = await supertest(app).get(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(200)
    })

})