"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instanceOfTokenPayload = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createUserToken = (payload) => {
    const token = jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { descriptor: 'TOKEN_PAYLOAD' }), env_1.secretKey);
    return token;
};
const instanceOfTokenPayload = (object) => {
    return object.descriptor === 'TOKEN_PAYLOAD';
};
exports.instanceOfTokenPayload = instanceOfTokenPayload;
exports.default = createUserToken;
