"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class UnprocessableError extends BaseError_1.default {
    constructor(message) {
        super(message);
        this.errorType = 'UNPROCESSABLE_ENTITY_ERROR';
        this.errorCode = 422;
        this.errorMessage = '';
        this.errorMessage = message;
    }
}
exports.default = UnprocessableError;
