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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = __importDefault(require("../errors/BaseError"));
const ServerError_1 = __importDefault(require("../errors/ServerError"));
const errorMiddleware = () => {
    return (error, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(error);
        if (error instanceof BaseError_1.default) {
            return res.status(error.errorCode).json(error.serializeError());
        }
        else {
            const serverError = new ServerError_1.default('Server Error');
            return res.status(serverError.errorCode).json(serverError.serializeError());
        }
    });
};
exports.default = errorMiddleware;
