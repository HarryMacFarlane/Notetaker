import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { COOKIE_OPTIONS } from './constants.js';
import dbRunner from '../Storage/storage.js';
import 'dotenv/config.js';

const authController = {
    authenticateUser: async (req, res, next) => {
        const accessToken = cookieParser.signedCookie(req.signedCookies['access_token'], process.env.COOKIE_SECRET);
        // Fallback to authorization header if cookies are not available
        accessToken ??= req.headers['authorization'].split(" ")[1];
        // FIX ERROR HERE FOR WHEN THE ACCESS TOKEN IS MODIFIED, N+AND NO AUTHORIZATION HEADER IS PROVIDED!!!
        if (!accessToken) {
            return res.status(401).json({ message: "No access token provided."});
        }
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid access token!"});
            }
            req.userID = decoded; // Attach the decoded token to the request so API routes can use it
            // PROVIDE THE USERID SOMEHOW, LOOK UP BEST PRACTICES!!!
            next();
        });
    },
    login : async (req, res) => {
        const { email, password } = req.body;
        // COMMENT THIS OUT LATER
        try {
            const { refreshToken, accessToken, timestamp } = await dbRunner.login(email, password);
    
            // Set refresh token in httpOnly cookie
            res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
            // Set access token to httpONly cookie for security (re-route to sessionStorage using client-side scripts if required)
            res.cookie("access_token", accessToken, COOKIE_OPTIONS);
    
            // Send access token in response
            return res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
        }
        catch (error) {
            res.status(401);
        }
    },
    register : async (req, res) => {
        const { fullname, email, password } = req.body;
        try {
            const { refreshToken, accessToken, timestamp } = await dbRunner.register(email, password);
            
            // Set refresh token in httpOnly cookie
            res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
            res.cookie("access_token", accessToken, COOKIE_OPTIONS);
    
            // Send access token in response
            return res.status(201).json({ 'access_token': accessToken, 'timestamp': timestamp });
        }
        catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
    },
    // FINISH REFRESH LOGIC HERE IN THE FUTURE!!!!
    refresh: async (req, res) => {
        const refreshToken = cookieParser.signedCookie(req.signedCookies['refresh_token'], process.env.COOKIE_SECRET);
        const userID = jwt.decode(req.signedCookies['access_token'], process.env.ACCESS_TOKEN_SECRET);
        // MODIFY THIS SO THAT THE DB QUERY USES THE USERID INSTEAD OF THE EMAIL!!!!
        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided. Ensure that cookies are enabled for automatic login and refresh!"});
        }

        try {
            const { _, accessToken, timestamp } = dbRunner.refreshSession(email, refreshToken);
            return res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
        }
        catch (e) {
            return res.status(500).json({ 'error': e.message }); 
        }
    },
    logout: (req, res) => {
        // ADD LOGIC HERE TO DELETE THE SESSION FROM THE DB!
        res.clearCookie("refresh_token", COOKIE_OPTIONS);
        res.clearCookie("access_token", COOKIE_OPTIONS);
        res.status(200).json({ message: "Logged out successfully" });
    }
}

export default authController;