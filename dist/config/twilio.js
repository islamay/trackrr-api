"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const twilio_1 = __importDefault(require("twilio"));
const twilio = (0, twilio_1.default)(env_1.twilioAccountSID, env_1.twilioApiKey);
exports.default = twilio;
