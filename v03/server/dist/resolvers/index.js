"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupResolver = exports.UserResolver = exports.HelloResolver = void 0;
var hello_1 = require("./hello");
Object.defineProperty(exports, "HelloResolver", { enumerable: true, get: function () { return __importDefault(hello_1).default; } });
var user_1 = require("./user");
Object.defineProperty(exports, "UserResolver", { enumerable: true, get: function () { return __importDefault(user_1).default; } });
var group_1 = require("./group");
Object.defineProperty(exports, "GroupResolver", { enumerable: true, get: function () { return __importDefault(group_1).default; } });
//# sourceMappingURL=index.js.map