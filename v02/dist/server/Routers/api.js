"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("./auth");
const ApiRouter = express_1.default.Router();
ApiRouter.use(auth_1.authenticateUser);
exports.default = ApiRouter;
//# sourceMappingURL=api.js.map