import { twilioVerifySID } from '../config/env'
import twilio from '../config/twilio'
import _twilio from 'twilio'

const verifyOTP = async (phone: string, code: string) => {

    try {
        const response = await twilio.verify.v2.services(twilioVerifySID)
            .verificationChecks
            .create({ to: phone, code })

        if (response.status === 'approved') return true
        else return false
    } catch (error) {
        return false
    }

}

export default verifyOTP