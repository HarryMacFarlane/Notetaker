import express from 'express';
import { dashRouter , authRouter } from './server/src/Routes/index.js';
import path from 'path';
import { fileURLToPath } from "url";

// Create a new express application
const app = express();

// Get the current directory (equivalent to __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add the necessary routes
app.use('/', authRouter);

app.use('/dashboard', dashRouter);

// Add the static routes for client scripts
app.use("/auth", express.static(path.join(__dirname, "/server/src/Auth/static")));

// Create a websocket server on top of this express application

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});