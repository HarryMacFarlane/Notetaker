"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const entities_1 = require("./entities");
const path_1 = __importDefault(require("path"));
exports.default = {
    dbName: "NoteTaker",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    debug: !constants_1.__prod__,
    entities: [entities_1.User],
    migrations: {
        path: path_1.default.join(__dirname, "./migrations"),
        pathTs: path_1.default.join(__dirname, "./migrations"),
    }
};
//# sourceMappingURL=micro-orm.config.js.map