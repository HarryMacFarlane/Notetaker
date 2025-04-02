import express from 'express';
import cookieParser from 'cookie-parser';
import dbRunner from '../Storage/storage.js';
import { COOKIE_OPTIONS } from './constants.js';
// Create a new express router
const authRouter = express.Router();

// Add the necessary middleware
authRouter.use(cookieParser()); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
authRouter.use(express.json());

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Auth/auth.html', { root: '.'});
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    // COMMENT THIS OUT LATER
    try {
        const { refreshToken, accessToken, timestamp } = await dbRunner.login(email, password);

        // Set refresh token in httpOnly cookie
        res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
        res.cookie("email", email, COOKIE_OPTIONS);

        // Set access token to httpONly cookie for security (re-route to sessionStorage using client-side scripts if required)
        res.cookie("access_token", accessToken, COOKIE_OPTIONS);

        // Send access token in response
        return res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
    }
    catch (error) {
        res.status(401);
    }
});

authRouter.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        const { refreshToken, accessToken, timestamp } = await dbRunner.register(email, password);
        
        // Set refresh token in httpOnly cookie
        res.cookie("refresh_token", refreshToken, COOKIE_OPTIONS);
        res.cookie("email", email, COOKIE_OPTIONS);
        // Set access token to httpONly cookie for security (re-route to sessionStorage using client-side scripts if required)
        res.cookie("access_token", accessToken, COOKIE_OPTIONS);

        // Send access token in response
        return res.status(201).json({ 'access_token': accessToken, 'timestamp': timestamp });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});

// FIX THIS TO PARSE THE SECURE SITE REFRESH TOKEN COOKIE!!!!!!
authRouter.post('/refresh', async (req, res) => {
    const refreshToken = req.signedCookies.refresh_token;
    const email = req.signedCookies.email;

    if (!refreshToken) {
        return res.status(401);
    }
    try {
        const { _, accessToken, timestamp } = dbRunner.refreshSession(email, refreshToken);
        return res.status(200).json({ 'access_token': accessToken, 'timestamp': timestamp });
    }
    catch (e) {
        return res.status(500).json({ 'error': e.message }); 
    }
});

// ADD LOGIC HERE TO UPDATE THE DATABASE
authRouter.post("/logout", (req, res) => {
    res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;