import express from 'express';
import cookieParser from 'cookie-parser';
import { authController } from '../Controllers/index.js';
import path from 'path';
import { fileURLToPath } from "url";
import 'dotenv/config.js';

const dashRouter = express.Router();
// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dashRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
dashRouter.use(authController.authenticateUser); // Authenticate user before allowing access to the dashboard
dashRouter.use("/assets", express.static("./UI/dist/assets"));

dashRouter.get("/", (req, res) => {
    res.status(200).sendFile('./UI/dist/index.html', {root: '.'})
})

export default dashRouter;