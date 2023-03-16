"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const threeDay = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000));
    return threeDaysFromNow;
};
exports.default = threeDay;
