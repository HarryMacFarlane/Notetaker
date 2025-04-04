import express from 'express';
import { dashRouter , authRouter, apiRouter } from './server/src/Router/index.js';
import path from 'path';
import { fileURLToPath } from "url";
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
// Create a new express application
const app = express();

// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser(process.env.COOKIE_SECRET));
// Add the necessary routes
app.use('/', authRouter);

app.use('/dashboard', dashRouter);

app.use('/api/v0', apiRouter);

// Add the static routes for client scripts
app.use("/auth", express.static(path.join(__dirname, "/server/src/Views/static")));

// Create a websocket server on top of this express application

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});