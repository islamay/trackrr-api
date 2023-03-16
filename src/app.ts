import 'express-async-errors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import createAuthRouter from './routes/auth'
import errorMiddleware from './middlewares/errorMiddleware'
import createCompanyRouter from './routes/company'
import createUserRouter from './routes/user'
import createInvitationRouter from './routes/invitation'

const app = express()

app.use(cors())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())

app.use('/users', createUserRouter())
app.use('/auth', createAuthRouter())
app.use('/company', createCompanyRouter())
app.use('/invitations', createInvitationRouter())

app.use(errorMiddleware())

export default app