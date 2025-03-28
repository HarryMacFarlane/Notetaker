import express from 'express';
import cookieParser from 'cookie-parser';
import dbRunner from '../Storage/storage.js';
// Create a new express router
const authRouter = express.Router();

// Add the necessary middleware
authRouter.use(cookieParser());

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Views/auth.html', { root: '.'});
});

authRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    try {
        const { refreshToken, accessToken } = dbRunner.login(email, password);

        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Send access token in response
        res.json({ accessToken });
    }
    catch (error) {
        res.status(401).send(error.message);
    }
});

authRouter.post('/register', (req, res) => {
    const { email, password } = req.body;
    try {
        dbRunner.register(email, password);
        // Set refresh token in httpOnly cookie
        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Send access token in response
        res.status(201).json({ accessToken });
    }
    catch (error) {
        res.status(400).send(error.message);
    }
});

export default authRouter;