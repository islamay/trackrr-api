"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createSession_1 = __importStar(require("../controllers/auth/createSession"));
const getSession_1 = __importStar(require("../controllers/auth/getSession"));
const createOtp_1 = __importStar(require("../controllers/auth/createOtp"));
const deleteSession_1 = __importStar(require("../controllers/auth/deleteSession"));
const createAuthRouter = () => {
    const router = (0, express_1.Router)();
    router.post('/otp', createOtp_1.otpValidation, (0, createOtp_1.default)());
    router.post('/session', createSession_1.validateCreateSession, (0, createSession_1.default)());
    router.get('/session/:sessionId', getSession_1.validateGetSession, (0, getSession_1.default)());
    router.delete('/session/:sessionId', deleteSession_1.validateDeleteSession, (0, deleteSession_1.default)());
    return router;
};
exports.default = createAuthRouter;
