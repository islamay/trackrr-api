"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const roleAuth = (roles, user, company) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.role === user_1.UserRole.ADMIN)
        return true;
    const i = user.companies.findIndex(c => c.companyId === company._id);
    if (i < 0)
        return false;
    const role = user.companies[i].role;
    const isAllowed = roles.some(r => r === role);
    if (!isAllowed)
        return false;
    return true;
});
exports.default = roleAuth;
