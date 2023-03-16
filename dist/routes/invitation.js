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
const createInvitation_1 = __importStar(require("../controllers/invitation/createInvitation"));
const deleteInvitation_1 = __importStar(require("../controllers/invitation/deleteInvitation"));
const getInvitation_1 = __importStar(require("../controllers/invitation/getInvitation"));
const getInvitations_1 = __importStar(require("../controllers/invitation/getInvitations"));
const invitationAction_1 = __importStar(require("../controllers/invitation/invitationAction"));
const patchInvitation_1 = __importStar(require("../controllers/invitation/patchInvitation"));
// TODO : Add each route a validator
const createInvitationRouter = () => {
    const router = (0, express_1.Router)();
    router.get('/', getInvitations_1.validateGetInvitations, (0, getInvitations_1.default)());
    router.post('/', createInvitation_1.validateCreateInvitation, (0, createInvitation_1.default)());
    router.get('/:invitationId', getInvitation_1.validateGetInvitation, (0, getInvitation_1.default)());
    router.patch('/:invitationId', patchInvitation_1.validatePatchInvitation, (0, patchInvitation_1.default)());
    router.delete('/:invitationId', deleteInvitation_1.validateDeleteInvitation, (0, deleteInvitation_1.default)());
    router.post('/:invitationId/action', invitationAction_1.validateInvitationAction, (0, invitationAction_1.default)());
    return router;
};
exports.default = createInvitationRouter;
