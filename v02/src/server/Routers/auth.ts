import express, {Request, Response, NextFunction, Router } from "express";
import asyncHandler from "express-async-handler";
import { AuthRequest } from "../Controllers/authRequest";
import { login as AuthLogin, register as AuthRegister, refresh as AuthRefresh } from "../Controllers/index";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateUser = asyncHandler((req : Request, res : Response, next : NextFunction) => {
    // Get the access token
    let accessToken : string | null = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken ??= req.signedCookies['access_token'];
    if (!accessToken) {
        res.status(401).json({ message: "Missing access token."});
        return
    }
    try {
        const payload : JwtPayload = jwt.verify(accessToken, process.env.TOKEN_SECRET, {complete : true});
        (req as AuthRequest).userID = payload['id'];
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ error: "" });
        return
    }
    next();
});

const AuthRouter : Router = express.Router();

AuthRouter.use("/auth", express.static("./Views/static"))

AuthRouter.get("/", (req :Request, res : Response) => {
    return res.sendFile("./Views/auth.html", { root: "."});
})

AuthRouter.post("/login", AuthLogin);

AuthRouter.post("/register", AuthRegister);

AuthRouter.post("/refresh", AuthRefresh);


export default AuthRouter;