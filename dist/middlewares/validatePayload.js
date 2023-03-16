"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const BaseError_1 = __importDefault(require("../errors/BaseError"));
const ValidationError_1 = __importDefault(require("../errors/ValidationError"));
const validatePayload = () => {
    return (req, res, next) => {
        const result = (0, express_validator_1.validationResult)(req);
        if (result.isEmpty())
            return next();
        if (req.body.error instanceof BaseError_1.default) {
            throw req.body.error;
        }
        const error = result.array()[0];
        const msg = `${error.msg} at ${error.param}`;
        throw new ValidationError_1.default(msg);
    };
};
exports.default = validatePayload;
