"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpValidation = void 0;
const express_validator_1 = require("express-validator");
const response_1 = __importDefault(require("../../lib/response"));
const sendOTP_1 = __importDefault(require("../../lib/sendOTP"));
const validatePayload_1 = __importDefault(require("../../middlewares/validatePayload"));
const validatePhone_1 = __importDefault(require("../../middlewares/validatePhone"));
exports.otpValidation = [
    (0, express_validator_1.body)('phone').notEmpty().isMobilePhone('id-ID').bail(),
    (0, validatePayload_1.default)(),
    (0, validatePhone_1.default)(true)
];
const otp = () => {
    return ({ body: { phone } }, res) => __awaiter(void 0, void 0, void 0, function* () {
        (0, sendOTP_1.default)(phone);
        res.json((0, response_1.default)('success'));
    });
};
exports.default = otp;
