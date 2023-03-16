import { Company, CompanyMember, MemberRole } from 'prisma/prisma-client'
import supertest from 'supertest'
import app from '../../../../src/app'
import client from '../../../../src/config/prisma'
import { createMember, createSetupVariabe, setup } from '../../setup'

const setupVar = createSetupVariabe()
let company: Company
let member: CompanyMember

const targets = Object.values(MemberRole)
const modifiers = Object.values(MemberRole)
const values = Object.values(MemberRole)

const cases = {
    [MemberRole.MEMBER + MemberRole.MEMBER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.MEMBER + MemberRole.MEMBER + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.MEMBER + MemberRole.MEMBER + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.MEMBER + MemberRole.OPERATOR + MemberRole.MEMBER]: { success: true, status: 200 },
    [MemberRole.MEMBER + MemberRole.OPERATOR + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.MEMBER + MemberRole.OPERATOR + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.MEMBER + MemberRole.OWNER + MemberRole.MEMBER]: { success: true, status: 200 },
    [MemberRole.MEMBER + MemberRole.OWNER + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.MEMBER + MemberRole.OWNER + MemberRole.OWNER]: { success: false, status: 403 },

    [MemberRole.OPERATOR + MemberRole.MEMBER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OPERATOR + MemberRole.MEMBER + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.OPERATOR + MemberRole.MEMBER + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.OPERATOR + MemberRole.OPERATOR + MemberRole.MEMBER]: { success: true, status: 200 },
    [MemberRole.OPERATOR + MemberRole.OPERATOR + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.OPERATOR + MemberRole.OPERATOR + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.OPERATOR + MemberRole.OWNER + MemberRole.MEMBER]: { success: true, status: 200 },
    [MemberRole.OPERATOR + MemberRole.OWNER + MemberRole.OPERATOR]: { success: true, status: 200 },
    [MemberRole.OPERATOR + MemberRole.OWNER + MemberRole.OWNER]: { success: false, status: 403 },

    [MemberRole.OWNER + MemberRole.MEMBER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.MEMBER + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.MEMBER + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OPERATOR + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OPERATOR + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OPERATOR + MemberRole.OWNER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OWNER + MemberRole.MEMBER]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OWNER + MemberRole.OPERATOR]: { success: false, status: 403 },
    [MemberRole.OWNER + MemberRole.OWNER + MemberRole.OWNER]: { success: false, status: 403 },
}

describe('PATCH /company/:companyId/members/:memberId', () => {

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
        describe(`Target role : ${target}`, () => {
            for (const modifier of modifiers) {
                describe(`Modifier role : ${modifier}`, () => {
                    for (const value of values) {
                        const useCase = cases[`${target}${modifier}${value}`]
                        const shouldOrNot = useCase.success ? 'should' : 'should not'
                        const testName = `${shouldOrNot} update member with role ${target} to ${value} by ${modifier}`

                        test(testName, async () => {
                            const member = await createMember(setupVar.user2.id, company.id, target)
                            await createMember(setupVar.user1.id, company.id, modifier)
                            const res = await supertest(app).patch(`/company/${company.id}/members/${member.id}`)
                                .set('Authorization', `Bearer ${setupVar.user1.session.token}`)
                                .send({ role: value })

                            expect(res.statusCode).toBe(useCase.status)
                        })
                    }
                })
            }

            describe('Modifier role : Admin', () => {
                for (const value of values) {
                    test(`should update member with role ${target} to ${value} by admin`, async () => {
                        const member = await createMember(setupVar.user2.id, company.id, target)

                        const res = await supertest(app).patch(`/company/${company.id}/members/${member.id}`)
                            .set('Authorization', `Bearer ${setupVar.admin.session.token}`)
                            .send({ role: value })

                        expect(res.statusCode).toBe(200)
                    })
                }
            })
        })
    }

    afterEach(async () => {
        await client.companyMember.deleteMany()
    })

})
