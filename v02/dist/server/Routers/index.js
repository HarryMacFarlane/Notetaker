"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiRouter = exports.DashRouter = exports.AuthRouter = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "AuthRouter", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var dashboard_1 = require("./dashboard");
Object.defineProperty(exports, "DashRouter", { enumerable: true, get: function () { return __importDefault(dashboard_1).default; } });
var api_1 = require("./api");
Object.defineProperty(exports, "ApiRouter", { enumerable: true, get: function () { return __importDefault(api_1).default; } });
//# sourceMappingURL=index.js.map