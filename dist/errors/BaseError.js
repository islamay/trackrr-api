"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
    serializeError() {
        return {
            errorType: this.errorType,
            errorCode: this.errorCode,
            errorMessage: this.errorMessage
        };
    }
}
exports.default = BaseError;
