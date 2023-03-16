"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class ValidationError extends BaseError_1.default {
    constructor(message) {
        super(message);
        this.errorType = 'VALIDATION_ERROR';
        this.errorCode = 400;
        this.errorMessage = '';
        this.errorMessage = message;
    }
}
exports.default = ValidationError;
