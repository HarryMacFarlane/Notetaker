"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cookie_parser_1 = require("cookie-parser");
var dotenv_1 = require("dotenv");
var index_1 = require("./Routers/index");
dotenv_1.default.config();
var app = (0, express_1.default)();
// Use cookie parser and json middle ware by default
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use(express_1.default.json());
// Load the different routers for the server
app.use('/', index_1.AuthRouter);
app.listen(3000, function () {
    console.log("Server running on http://localhost:3000");
});
