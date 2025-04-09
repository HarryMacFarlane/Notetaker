import express from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../Controllers/index.js';
import path from 'path';
import { fileURLToPath } from "url";

// Create a new express router
const authRouter = express.Router();

// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add the necessary middleware
authRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
authRouter.use(express.json());
authRouter.use("/auth", express.static("./server/src/Views/static"));

// Add the necessary routes
authRouter.get('/', (req, res) => {
    res.sendFile('/server/src/Views/auth.html', { root: '.'});
});

authRouter.post('/login', authController.login);

authRouter.post('/register', authController.register);

authRouter.post('/refresh', (req, res) => authController.authenticateUser(req, res, authController.refresh));

// ADD LOGIC HERE TO UPDATE THE DATABASE
authRouter.post("/logout", authController.logout);

export default authRouter;