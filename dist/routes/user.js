"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const createUser_1 = __importStar(require("../controllers/user/createUser"));
const deleteUser_1 = __importStar(require("../controllers/user/deleteUser"));
const getUser_1 = __importStar(require("../controllers/user/getUser"));
const getUsers_1 = __importStar(require("../controllers/user/getUsers"));
const patchUser_1 = __importStar(require("../controllers/user/patchUser"));
const createUserRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/', getUsers_1.validateGetUsers, (0, getUsers_1.default)());
    router.post('/', createUser_1.validateCreateUser, (0, createUser_1.default)());
    router.get('/:userId', getUser_1.validateGetUser, (0, getUser_1.default)());
    router.patch('/:userId', patchUser_1.validatePatchUser, (0, patchUser_1.default)());
    router.delete('/:userId', deleteUser_1.validateDeleteUser, (0, deleteUser_1.default)());
    return router;
};
exports.default = createUserRouter;
