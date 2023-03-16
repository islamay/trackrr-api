import 'dotenv/config'

export const secretKey = process.env.SECRET_KEY || ''

export const twilioApiKey = process.env.TWILIO_API_KEY || ''
export const twilioAccountSID = process.env.TWILIO_ACCOUNT_SID || ''
export const twilioVerifySID = process.env.TWILIO_VERIFY_SID || ''