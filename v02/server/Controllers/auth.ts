import { Request, Response } from "express";
import { authData, AuthModel, SessionModel, findUser } from "../Models/index";
import { COOKIE_OPTIONS, JWT_DECODE_OPTIONS } from "./constants";
import jwt, { JwtPayload } from "jsonwebtoken";

export const AuthController = {
    login: async (req : Request, res : Response) => {
        const data : authData = req.body;
        const user = new AuthModel(data);
        try {
            const { refreshToken, accessToken } = await user.login();
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not sign in!"});
        }
    },
    register: (req : Request, res : Response) => {
        const data : authData = req.body;
        const user = new AuthModel(data);
        try {
            const { refreshToken, accessToken } = user.register();
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not register!"});
        }
    },
    refresh: (req : Request, res : Response) => {

        let accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
        accessToken ??= req.signedCookies['access_token'];

        if (!accessToken) {
            return res.status(401).json({ error: "Could not validate identity! "})
        }


        const payload : null | JwtPayload | string = jwt.decode(accessToken, JWT_DECODE_OPTIONS);

        if (!payload) {
            return res.status(401).json({ error: "Could not validate identity! "})
        }

        try {
            const user = findUser(Number(payload))

            const session = new SessionModel(user);

            const { accessToken, refreshToken } = session.handleSession();
            // ADD SOME CODE HERE TO VERIFY WE ARE PROCEEDING EFFECTIVELY!
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (error) {
            return res.status(500).json({ error: "Problem on our end. Please log in again!"})
        }



        // Complete this function to verify what type of payload we have (in theory i should ALWAYS be a json with a number...)
    }
}