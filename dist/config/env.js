"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twilioVerifySID = exports.twilioAccountSID = exports.twilioApiKey = exports.secretKey = void 0;
require("dotenv/config");
exports.secretKey = process.env.SECRET_KEY || '';
exports.twilioApiKey = process.env.TWILIO_API_KEY || '';
exports.twilioAccountSID = process.env.TWILIO_ACCOUNT_SID || '';
exports.twilioVerifySID = process.env.TWILIO_VERIFY_SID || '';
