import { Company, CompanyMember, MemberRole, UserRole } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createMember, createSetupVariabe, setup } from '../../setup'

const cases = {
    [MemberRole.MEMBER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.MEMBER + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.MEMBER + MemberRole.OWNER]: { success: true, status: 200 },

    [MemberRole.OPERATOR + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OPERATOR + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.OPERATOR + MemberRole.OWNER]: { success: true, status: 200 },

    [MemberRole.OWNER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OWNER]: { success: false, status: 403 },
}

const targets = Object.values(MemberRole)
const requesters = Object.values(MemberRole)

const setupVar = createSetupVariabe()
let company: Company
let member: CompanyMember


describe('DELETE /company/:companyId/members/:memberId', () => {

    beforeAll(async () => {
        await setup(setupVar)
        const res = await supertest(app).post('/company')
            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
            .send({ name: 'PT. Mukhlis' })

        company = res.body.body.company
    })

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })

    for (const target of targets) {
        describe(`Delete target role : ${target}`, () => {
            for (const requester of requesters) {

                const useCase = cases[target + requester]
                const shouldOrNot = useCase.success ? 'should' : 'should not'
                const testName = `${shouldOrNot} delete member with role ${target} by ${requester}`

                it(testName, async () => {
                    const member = await createMember(setupVar.user2.id, company.id, target)
                    await createMember(setupVar.user1.id, company.id, requester)

                    const res = await supertest(app).delete(`/company/${company.id}/members/${member.id}`)
                        .set('Authorization', `Bearer ${setupVar.user1.session.token}`)

                    expect(res.statusCode).toBe(useCase.status)
                })
            }

            it(`should delete member with role ${target} by admin`, async () => {
                const member = await createMember(setupVar.user2.id, company.id, target)
                const res = await supertest(app).delete(`/company/${company.id}/members/${member.id}`)
                    .set('Authorization', `Bearer ${setupVar.admin.session.token}`)

                expect(res.statusCode).toBe(200)
            })
        })
    }
})