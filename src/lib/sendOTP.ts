import { twilioVerifySID } from "../config/env"
import twilio from "../config/twilio"

const sendOTP = async (phone: string) => {

    await twilio.verify.v2.services(twilioVerifySID)
        .verifications
        .create({ to: phone, channel: 'whatsapp' })
}

export default sendOTP