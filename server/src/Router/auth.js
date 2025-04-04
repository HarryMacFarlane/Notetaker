import express from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../Controllers/index.js';

// Create a new express router
const authRouter = express.Router();

// Add the necessary middleware
authRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
authRouter.use(express.json());

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Views/auth.html', { root: '.'});
});

authRouter.post('/login', authController.login);

authRouter.post('/register', authController.register);

// FIX THIS TO PARSE THE SECURE SITE REFRESH TOKEN COOKIE!!!!!!
authRouter.post('/refresh', authController.refresh);

// ADD LOGIC HERE TO UPDATE THE DATABASE
authRouter.post("/logout", authController.logout);

export default authRouter;