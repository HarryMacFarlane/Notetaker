import express, {Request, Response, NextFunction, Router, RequestHandler} from "express";
import { AuthRequest } from "../Controllers/authRequest";
import { AuthController } from "../Controllers/index";
import { JWT_VRFY_OPTIONS } from "./constants";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authenticateUser = (req : Request, res : Response, next : NextFunction) => {
    // Get the access token
    let accessToken : string | null = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
    accessToken ??= req.signedCookies['access_token'];
    if (!accessToken) {
        return res.status(401).json({ message: "Missing access token."});
    }
    try {
        const payload : JwtPayload = jwt.verify(accessToken, process.env.TOKEN_SECRET, {complete : true});
        (req as AuthRequest).userID = payload['id'];
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ error: "" });
    }
    next();
}

const AuthRouter : Router = express.Router();

AuthRouter.use("/auth", express.static("./Views/static"))

AuthRouter.get("/", (req :Request, res : Response) => {
    res.sendFile("./server/Views/auth.html", { root: "."});
})

AuthRouter.post("/login", AuthController.login as RequestHandler);

AuthRouter.post("/register", AuthController.register as RequestHandler);

AuthRouter.post("/refresh", AuthController.refresh as RequestHandler);


export default AuthRouter;