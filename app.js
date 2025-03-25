import express from 'express';
import authRouter from './server/src/Routes/auth.js';
import path from 'path';
import { fileURLToPath } from "url";

// Create a new express application
const app = express();

// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add the necessary routes
app.use('/', authRouter);

// Add the static routes for client scripts
app.use("/static", express.static(path.join(__dirname, "client/src")));

// Create a websocket server on top of this express application

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});