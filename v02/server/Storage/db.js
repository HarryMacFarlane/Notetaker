"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_sqlite3_1 = require("better-sqlite3");
var db = new better_sqlite3_1.default("./server/Storage/notetaker_dev.db");
exports.default = db;
