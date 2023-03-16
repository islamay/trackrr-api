import generateToken from '../lib/generateToken'
import client from './prisma'

const seed = async () => {
    const user = await client.user.create({
        data: {
            name: 'Muhammad Ilham',
            phone: '082166689693',
            role: 'USER'
        }
    })

    await client.session.create({
        data: {
            userId: user.id,
            token: generateToken({ userId: user.id })
        }
    })
}

const seed_session = async () => {
    const user = await client.user.findUnique({
        where: { id: 'f9b8da26-2dec-453a-aded-a3726b929cfb' }
    })

    if (!user) throw new Error('user not found')

    await client.session.create({
        data: {
            token: generateToken({ userId: user.id }),
            userId: user.id
        }
    })
}

seed()
    .then(() => console.log('success'))

// seed_session()
//     .then(() => console.log('success'))