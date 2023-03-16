import { Session, User, UserRole } from "@prisma/client";
import generateToken from "../../src/lib/generateToken";
import { PrismaClient } from '@prisma/client'
import casual from 'casual'
import { MemberRole, Workshift } from "prisma/prisma-client";

const client = new PrismaClient()

casual.define('indonesianPhoneNumber', function () {
    const phonePrefixes = ['+62811', '+62812', '+62813', '+62821', '+62822', '+62823', '+62851', '+62852', '+62853', '+62814', '+62815', '+62816', '+62855', '+62856', '+62857', '+62817', '+62818', '+62819', '+62859', '+62877', '+62878'];
    const randomPrefix = phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)];
    const randomNumber = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    return `${randomPrefix}${randomNumber}`;
});

export const createUser = async (role?: UserRole) => {
    const user = await client.user.create({
        data: {
            name: casual.name,
            // @ts-ignore
            phone: casual.indonesianPhoneNumber,
            role: role || 'USER'
        }
    })

    return user
}

export const createUserSession = async (userId: string) => {
    const session: Session = await client.session.create({
        data: {
            userId: userId,
            token: generateToken({ userId })
        }
    })

    return session
}

export const createUserAndSession = async (role?: UserRole): Promise<[User, Session]> => {
    const user = await createUser(role)
    const session = await createUserSession(user.id)
    return [user, session]
}

export const createCompany = async (name: string) => {
    const company = await client.company.create({ data: { name } })
    return company
}

export const createMember = async (userId: string, companyId: string, role?: MemberRole) => {
    const member = await client.companyMember.create({
        data: { userId, companyId, role: role || 'MEMBER' }
    })

    return member
}

export const createWorkshift = async (data: Omit<Workshift, 'id'>) => {
    const workshift = await client.workshift.create({
        data: {
            companyId: data.companyId,
            name: data.name,
            workingStart: data.workingStart,
            workingEnd: data.workingEnd
        }
    })

    return workshift
}

export const createWorkshiftMember = async (workshiftId: string, companyMemberId: string) => {
    const workshiftMember = await client.workshiftMember.create({
        data: {
            workshiftId,
            companyMemberId
        }
    })

    return workshiftMember
}

export const createAttendance = async (workshiftId: string, workshiftMemberId: string) => {
    const attendance = await client.attendance.create({
        data: {
            workshiftId,
            workshiftMemberId,
            status: 'ONGOING'
        }
    })

    return attendance
}

interface ISetupObject {
    user1: User & { session: Session },
    user2: User & { session: Session },
    admin: User & { session: Session },
}

export const createSetupVariabe = (): ISetupObject => {
    return {
        // @ts-ignore
        user1: undefined, user2: undefined, admin: undefined,
    }
}

export const setup = async (obj: any) => {
    const [user1, session1] = await createUserAndSession()
    const [user2, session2] = await createUserAndSession()
    const [admin, adminSession] = await createUserAndSession('ADMIN')

    obj.user1 = { ...user1, session: session1 }
    obj.user2 = { ...user2, session: session2 }
    obj.admin = { ...admin, session: adminSession }
}

export const teardown = async () => {
    await client.user.deleteMany({})
}

export const createUsers = async (count: number) => {
    const users: User[] = []
    for (let i = 0; i < count; i++) {
        const user: User = await client.user.create({
            data: {
                name: casual.name,
                // @ts-ignore
                phone: casual.indonesianPhoneNumber
            }
        })
        users.push(user)
    }

    return users
}

