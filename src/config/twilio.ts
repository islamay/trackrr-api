import { twilioApiKey, twilioAccountSID } from './env'
import createTwilio from 'twilio'

const twilio = createTwilio(twilioAccountSID, twilioApiKey)

export default twilio