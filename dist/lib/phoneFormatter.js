"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phoneFormatter = (phone) => {
    if (phone.startsWith('+62'))
        return phone;
    if (!phone.startsWith('0'))
        return false;
    return phone.replace(/^0/, '+62');
};
exports.default = phoneFormatter;
