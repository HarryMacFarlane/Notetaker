import express from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../Controllers/index.js';
import 'dotenv/config.js';

const dashRouter = express.Router();

dashRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
dashRouter.use(authController.authenticateUser); // Authenticate user before allowing access to the dashboard

dashRouter.get("/", (req, res) => {
    res.status(200).send("<h1> Provide the index.html file here in the future! </h1>")
})

export default dashRouter;