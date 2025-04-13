"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const index_1 = require("../Controllers/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.authenticateUser = (0, express_async_handler_1.default)((req, res, next) => {
    let accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken ?? (accessToken = req.signedCookies['access_token']);
    if (!accessToken) {
        res.status(401).json({ message: "Missing access token." });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(accessToken, process.env.TOKEN_SECRET, { complete: true });
        req.userID = payload['id'];
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ error: "" });
        return;
    }
    next();
});
const AuthRouter = express_1.default.Router();
AuthRouter.use("/auth", express_1.default.static("./Views/static"));
AuthRouter.get("/", (req, res) => {
    return res.sendFile("./Views/auth.html", { root: "." });
});
AuthRouter.post("/login", index_1.login);
AuthRouter.post("/register", index_1.register);
AuthRouter.post("/refresh", index_1.refresh);
exports.default = AuthRouter;
//# sourceMappingURL=auth.js.map