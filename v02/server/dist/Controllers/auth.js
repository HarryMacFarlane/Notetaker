var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthModel, SessionModel, findUser } from "../Models/index";
import { COOKIE_OPTIONS, JWT_DECODE_OPTIONS } from "./constants";
import jwt from "jsonwebtoken";
export const AuthController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const data = req.body;
        const user = new AuthModel(data);
        try {
            const { refreshToken, accessToken } = yield user.login();
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not sign in!" });
        }
    }),
    register: (req, res) => {
        const data = req.body;
        const user = new AuthModel(data);
        try {
            const { refreshToken, accessToken } = user.register();
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Could not register!" });
        }
    },
    refresh: (req, res) => {
        let accessToken = (req.headers['authorization']) ? req.headers['authorization'].split(" ")[1] : null;
        accessToken !== null && accessToken !== void 0 ? accessToken : (accessToken = req.signedCookies['access_token']);
        if (!accessToken) {
            return res.status(401).json({ error: "Could not validate identity! " });
        }
        const payload = jwt.decode(accessToken, JWT_DECODE_OPTIONS);
        if (!payload) {
            return res.status(401).json({ error: "Could not validate identity! " });
        }
        try {
            const user = findUser(Number(payload));
            const session = new SessionModel(user);
            const { accessToken, refreshToken } = session.handleSession();
            // ADD SOME CODE HERE TO VERIFY WE ARE PROCEEDING EFFECTIVELY!
            res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
            res.cookie('access_token', accessToken, COOKIE_OPTIONS);
            res.status(200).json({ message: "Successful login!", access_token: accessToken });
        }
        catch (error) {
            return res.status(500).json({ error: "Problem on our end. Please log in again!" });
        }
        // Complete this function to verify what type of payload we have (in theory i should ALWAYS be a json with a number...)
    }
};
