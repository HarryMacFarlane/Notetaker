import jwt, { JwtPayload } from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { COOKIE_OPTIONS } from './constants.js';
import 'dotenv/config.js';
import { AuthModel, authData } from '../Models/index.js';
import { Response, Request, NextFunction, RequestParamHandler } from 'express';
import { JWT_SIGN_OPTIONS } from '../Models/constants.js';
import { AuthRequest } from './interface.js';

export const authenticateUser = async (req : Request, res : Response, next : NextFunction) => {

    let accessToken : string | null | false = (req.headers['authorization']) ? 
    req.headers['authorization'].split(" ")[1] : 
    null;
    accessToken ??= cookieParser.signedCookie(req.signedCookies['access_token'], process.env.COOKIE_SECRET);
    
    if (!accessToken) {
        return res.status(401).json({ error: "No access token provided!"});
    }
    
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, {complete: true}, (err, decoded) => {
        if (err || !decoded) {
            // Add something here to attempt a refresh???
            return res.status(401).json({ message: "Invalid access token!"});
        }
        const user_id = Number(decoded.payload);
        if (!user_id) {
            return res.status(401).json({ message: "Invalid access token!"});
        }
        (req as AuthRequest).user_id = user_id;
        next();
    });
};

const authController = {
    login : async (req : Request, res : Response) => {
        const data : authData | null = req.body
        if (!data) {
            console.error("Could not retrive auth data from request body")
            return res.status(500).json({error: "Could not parse input data, try again later!"})
        }
        const auth = new AuthModel(data);
        // COMMENT THIS OUT LATER
        await auth.login()
        .then(
            ({refreshToken, accessToken, timestamp}) => {
                // Set refresh token in httpOnly cookie
                res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
                // Set access token to httpONly cookie for security (re-route to sessionStorage using client-side scripts if required)
                res.cookie("access_token", accessToken, COOKIE_OPTIONS);
                res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
            }
        )
        .catch(
            (err : Error) => {
                console.error(err);
                return res.status(401).json({error: err});
            }
        )
    },
    register: async (req : Request, res : Response) => {
        const auth = new AuthModel(req.body);

        return await auth.register()
        .then(
            ({refreshToken, accessToken, timestamp}) => {
                // Set refresh token in httpOnly cookie
                res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
                res.cookie("access_token", accessToken, COOKIE_OPTIONS);
    
                // Send access token in response
                return res.status(201).json({ 'access_token': accessToken, 'timestamp': timestamp });
            }
        )
        .catch( 
            (err) => {
                console.error(err);
                res.status(400).json({error: err.message});
            }
        );
    },
    // FINISH REFRESH LOGIC HERE IN THE FUTURE!!!!
    refresh: async (req : Request, res : Response) => {
        const old_refreshToken : string | false = req.signedCookies['refresh_token'];
        // Attempt to recover the initial access token to get the user's id
        let old_accessToken : string | false | null = (req.headers['authorization']) ? 
        req.headers['authorization'].split(" ")[1]: 
        null;
        old_accessToken ??= req.signedCookies['access_token'];
        if (!old_accessToken || !old_refreshToken) {
            return res.status(401).json({ error: "Authentication information is missing. Please re-authenticate!"});
        }

        const decoded = jwt.decode(old_accessToken, {complete: true});

        if (!decoded?.payload) {
            return res.status(401).json({ error: "Access token is corrupted. Please re-authenticate."});
        }

        const user_id = (decoded as JwtPayload)['id'];

        const user = new AuthModel({email: "NAN", password: "NAN"})
        
        const {refreshToken, accessToken, timestamp} =  user.handleSession(user_id);

        res.clearCookie('refresh_token');
        res.clearCookie('access_token');
        res.cookie('refresh_token', refreshToken, COOKIE_OPTIONS);
        res.cookie('access_token', accessToken, COOKIE_OPTIONS);
        res.status(200).json({message: "Successful re-authentication!", expiration: timestamp});
    },
    logout: (req : Request, res : Response) => {
        // ADD LOGIC HERE TO DELETE THE SESSION FROM THE DB!
        res.clearCookie("refresh_token", COOKIE_OPTIONS);
        res.clearCookie("access_token", COOKIE_OPTIONS);
        res.status(200).json({ message: "Logged out successfully" });
    }
}

export default authController;