"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = exports.register = exports.login = void 0;
const index_1 = require("../Models/index");
const constants_1 = require("./constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.login = (0, express_async_handler_1.default)(async (req, res) => {
    const data = req.body;
    const user = new index_1.AuthModel(data);
    try {
        const { refreshToken, accessToken } = await user.login();
        res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
        res.cookie('access_token', accessToken, constants_1.COOKIE_OPTIONS);
        res.status(200).json({ message: "Successful login!", access_token: accessToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not sign in!" });
    }
});
exports.register = (0, express_async_handler_1.default)((req, res) => {
    const data = req.body;
    const user = new index_1.AuthModel(data);
    try {
        const { refreshToken, accessToken } = user.register();
        res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
        res.cookie('access_token', accessToken, constants_1.COOKIE_OPTIONS);
        res.status(200).json({ message: "Successful login!", access_token: accessToken });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Could not register!" });
    }
});
exports.refresh = (0, express_async_handler_1.default)((req, res) => {
    let accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken ?? (accessToken = req.signedCookies['access_token']);
    if (!accessToken) {
        res.status(401).json({ error: "Could not validate identity! " });
        return;
    }
    const payload = jsonwebtoken_1.default.decode(accessToken, constants_1.JWT_DECODE_OPTIONS);
    if (!payload) {
        res.status(401).json({ error: "Could not validate identity! " });
    }
    try {
        const user = (0, index_1.findUser)(Number(payload));
        const session = new index_1.SessionModel(user);
        const { accessToken, refreshToken } = session.handleSession();
        res.cookie('refresh_token', refreshToken, constants_1.COOKIE_OPTIONS);
        res.cookie('access_token', accessToken, constants_1.COOKIE_OPTIONS);
        res.status(200).json({ message: "Successful login!", access_token: accessToken });
    }
    catch (error) {
        res.status(500).json({ error: "Problem on our end. Please log in again!" });
    }
});
//# sourceMappingURL=auth.js.map