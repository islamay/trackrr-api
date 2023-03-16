"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateExtractor = exports.dateValidator = void 0;
const dateValidator = (value) => {
    const regex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return regex.test(value);
};
exports.dateValidator = dateValidator;
const dateExtractor = (input) => {
    const times = input.split(':');
    return times;
};
exports.dateExtractor = dateExtractor;
