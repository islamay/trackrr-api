import { Attendance, Company, CompanyMember, MemberRole, Workshift } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../../src/app'
import client from '../../../../../src/config/prisma'
import { createAttendance, createCompany, createMember, createSetupVariabe, createWorkshift, createWorkshiftMember, setup } from '../../../setup'

const setupVar = createSetupVariabe()
let company: Company
let workshift: Workshift
let attendance: Attendance

describe('PATCH /company/:companyId/workshifts/:workshiftId/attendances', () => {
    beforeAll(async () => {
        await setup(setupVar)
        company = await createCompany('PT. Mukhlis Jaya Abadi')
        workshift = await createWorkshift({
            companyId: company.id,
            name: 'pagi',
            workingStart: '08:00:00',
            workingEnd: '17:00:00'
        })
    })

    beforeEach(async () => {
        const member = await createMember(setupVar.user2.id, company.id)
        const workshiftMember = await createWorkshiftMember(workshift.id, member.id)
        attendance = await createAttendance(workshift.id, workshiftMember.id)
    })

    afterEach(async () => {
        await client.companyMember.deleteMany({
            where: {
                userId: setupVar.user1.id
            }
        })
    })

    it('should update the attendance status successfully for attendance creator', async () => {
        const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
            .set('Authorization', `Bearer ${setupVar.user2.session.token}`)
        expect(res.statusCode).toBe(200)
    })

    it('should not update the attendance status successfully for non creator', async () => {
        const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
        expect(res.statusCode).toBe(403)
    })

    describe('non creator cases', () => {
        const roles = Object.values(MemberRole)
        for (const role of roles) {
            it('should not update the attendance status successfully for non creator', async () => {
                await createMember(setupVar.user1.id, company.id, role)
                const res = await supertest(app).patch(`/company/${company.id}/workshifts/${workshift.id}/attendances/${attendance.id}`)
                    .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                expect(res.statusCode).toBe(403)
            })
        }
    })


})