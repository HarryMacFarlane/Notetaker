import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { COOKIE_OPTIONS } from './constants.js';
import 'dotenv/config.js';
import { UserModel } from '../Models/index.js';

const authController = {
    authenticateUser: async (req, res, next) => {
        console.log(req.signedCookies)
        const accessToken = cookieParser.signedCookie(req.signedCookies['access_token'], process.env.COOKIE_SECRET);
        // FIX ERROR HERE FOR WHEN THE ACCESS TOKEN IS MODIFIED, N+AND NO AUTHORIZATION HEADER IS PROVIDED!!!
        if (!accessToken) {
            try {
                accessToken ??= req.headers['authorization'].split(" ")[1];
            }
            catch (e) {
                return res.status(401).json({ message: "No access token provided."});
            }
        }
        
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                // Add something here to attempt a refresh???
                return res.status(401).json({ message: "Invalid access token!"});
            }
            req.userID = decoded.id; // Attach the decoded token to the request so API routes can use it
            // PROVIDE THE USERID SOMEHOW, LOOK UP BEST PRACTICES!!!
            next();
        });
    },
    login : async (req, res) => {
        const user = new UserModel(req.body);
        // COMMENT THIS OUT LATER
        return await user.login()
        .then(
            ({refreshToken, accessToken, timestamp}) => {
                // Set refresh token in httpOnly cookie
                res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
                // Set access token to httpONly cookie for security (re-route to sessionStorage using client-side scripts if required)
                res.cookie("access_token", accessToken, COOKIE_OPTIONS);
                return res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
            }
        )
        .catch(
            (err) => {
                console.error(err);
                res.status(401).json({error: err});
            }
        )
    },
    register : async (req, res) => {
        const user = new UserModel(req.body);

        return await user.register()
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
    refresh: async (req, res, next) => {
        const refreshToken = cookieParser.signedCookie(req.signedCookies['refresh_token'], process.env.COOKIE_SECRET);
        try {
            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token provided. Ensure that cookies are enabled for automatic login and refresh!"});
            }
            const accessToken = (req.signedCookies) ? 
            req.signedCookies['access_token'] : 
            req.headers['authorization'].split(" ")[1];
        }
        catch (err) {
            return res.status(401).json({error: err})
        }
        const user = new UserModel({})
        return user.handleSession(req.userID);
    },
    logout: (req, res) => {
        // ADD LOGIC HERE TO DELETE THE SESSION FROM THE DB!
        res.clearCookie("refresh_token", COOKIE_OPTIONS);
        res.clearCookie("access_token", COOKIE_OPTIONS);
        res.status(200).json({ message: "Logged out successfully" });
    }
}

export default authController;