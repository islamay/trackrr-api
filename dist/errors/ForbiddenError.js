"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("./BaseError"));
class ForbiddenError extends BaseError_1.default {
    constructor(message) {
        super(message);
        this.errorType = 'FORBIDDEN_ERROR';
        this.errorCode = 403;
        this.errorMessage = '';
        this.errorMessage = message;
    }
}
exports.default = ForbiddenError;
