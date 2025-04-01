import express from 'express';
import cookieParser from 'cookie-parser';
import dbRunner from '../Storage/storage.js';
// Create a new express router
const authRouter = express.Router();

// Add the necessary middleware
authRouter.use(cookieParser());
authRouter.use(express.json());

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Auth/auth.html', { root: '.'});
});

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    // COMMENT THIS OUT LATER
    try {
        const { refreshToken, accessToken } = dbRunner.login(email, password);

        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Send access token in response
        res.json({ 'access_token': accessToken, 'email': email });
    }
    catch (error) {
        res.status(401);
    }
});

authRouter.post('/register', async (req, res) => {
    const { email, password } = req.body;
    console.log(`User tried creating account with email: ${email} and password: ${password}`)
    try {
        const { refreshToken, accessToken } = dbRunner.register(email, password);
        
        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Send access token in response
        res.status(201).json({ accessToken });
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});

// ADD LOGIC HERE TO UPDATE THE DATABASE
authRouter.post("/logout", (req, res) => {
    res.clearCookie("refresh_token", { httpOnly: true, secure: true, sameSite: "Strict" });
    res.status(200).json({ message: "Logged out successfully" });
});

export default authRouter;