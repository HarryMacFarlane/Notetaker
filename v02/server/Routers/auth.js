"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
var express_1 = require("express");
var index_1 = require("../Controllers/index");
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var authenticateUser = function (req, res, next) {
    // Get the access token
    var accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken !== null && accessToken !== void 0 ? accessToken : (accessToken = req.signedCookies['access_token']);
    if (!accessToken) {
        return res.status(401).json({ message: "Missing access token." });
    }
    try {
        var payload = jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET, { complete: true });
        req.userID = payload['id'];
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: "" });
    }
    next();
};
exports.authenticateUser = authenticateUser;
var AuthRouter = express_1.default.Router();
AuthRouter.use("/auth", express_1.default.static("./Views/static"));
AuthRouter.get("/", function (req, res) {
    res.sendFile("./server/Views/auth.html", { root: "." });
});
AuthRouter.post("/login", index_1.AuthController.login);
AuthRouter.post("/register", index_1.AuthController.register);
AuthRouter.post("/refresh", index_1.AuthController.refresh);
exports.default = AuthRouter;
