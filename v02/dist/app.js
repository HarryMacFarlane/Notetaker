import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { AuthRouter } from "./Routers/index.js";
dotenv.config();
const app = express();
// Use cookie parser and json middle ware by default
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
// Load the different routers for the server
app.use('/', AuthRouter);
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
