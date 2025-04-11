import express from "express";
import { AuthController } from "../Controllers/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authenticateUser = (req, res, next) => {
    // Get the access token
    let accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken !== null && accessToken !== void 0 ? accessToken : (accessToken = req.signedCookies['access_token']);
    if (!accessToken) {
        return res.status(401).json({ message: "Missing access token." });
    }
    try {
        const payload = jwt.verify(accessToken, process.env.TOKEN_SECRET, { complete: true });
        req.userID = payload['id'];
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: "" });
    }
    next();
};
const AuthRouter = express.Router();
AuthRouter.use("/auth", express.static("./Views/static"));
AuthRouter.get("/", (req, res) => {
    res.sendFile("./server/Views/auth.html", { root: "." });
});
AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/register", AuthController.register);
AuthRouter.post("/refresh", AuthController.refresh);
export default AuthRouter;
