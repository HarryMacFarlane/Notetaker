import express, { NextFunction, RequestHandler } from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../Controllers/index.js';
import path from 'path';
import { fileURLToPath } from "url";

// Create a new express router
const authRouter = express.Router();

// Add the necessary middleware
authRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
authRouter.use(express.json());
authRouter.use("/auth", express.static("./server/src/Views/static"));

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Views/auth.html', { root: '.'});
});

authRouter.post('/login', authController.login as RequestHandler);

authRouter.post('/register', authController.register as RequestHandler);

authRouter.post('/refresh', authController.refresh as RequestHandler);

// ADD LOGIC HERE TO UPDATE THE DATABASE
authRouter.post("/logout", authController.logout);

export default authRouter;