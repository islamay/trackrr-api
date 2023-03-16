"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response = (status, body) => {
    if (!body)
        return {
            status
        };
    return {
        status,
        body
    };
};
exports.default = response;
