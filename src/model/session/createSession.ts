import client from '../../config/prisma'
import { Session } from '@prisma/client'
import generateToken from '../../lib/generateToken'


export const createSession = async ({ userId }: Pick<Session, 'userId'>) => {
    const count = await client.session.count({
        where: {
            userId
        },
    })

    if (count >= 5) {
        const tokens = await client.session.findMany({
            where: { userId },
            orderBy: { created: 'asc' },
            take: count - 5 - 1
        })

        await client.session.deleteMany({
            where: {
                id: {
                    in: tokens.map(session => session.id)
                }
            }
        })
    }

    const token = generateToken({ userId })

    const session = await client.session.create({ data: { userId, token } })

    console.log(token);
    console.log(session.token);



    return session
}
