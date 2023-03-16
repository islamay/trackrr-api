import { WorkshiftMember } from '@prisma/client'
import { RequestHandler } from 'express'
import client from '../../config/prisma'
import BaseError from '../../errors/BaseError'
import ForbiddenError from '../../errors/ForbiddenError'
import { IBodyAfterMemberRole } from './companyMemberAuth'

export interface IBodyAfterWorkshiftAuth extends IBodyAfterMemberRole {
    workshiftMember: WorkshiftMember
}

interface IParams {
    workshiftId: string
}
interface IBody extends IBodyAfterWorkshiftAuth { }
interface IQuery { }

const workshiftAuth = (): RequestHandler<IParams, {}, IBody, IQuery> => {
    return async (req, res, next) => {
        try {
            const workshiftMember = await client.workshiftMember.findFirst({
                where: {
                    workshiftId: req.params.workshiftId,
                    companyMemberId: req.body.membership.id
                }
            })

            if (!workshiftMember) throw new ForbiddenError('Forbidden')
            req.body.workshiftMember = workshiftMember

            return next()
        } catch (error) {
            if (error instanceof BaseError) {
                throw error
            } else {
                throw new ForbiddenError('Forbidden')
            }
        }

    }
}

export default workshiftAuth