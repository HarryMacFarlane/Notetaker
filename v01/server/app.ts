import express from 'express';
import { dashRouter , authRouter, apiRouter } from './src/Router/index.js';
import 'dotenv/config.js';
import cookieParser from 'cookie-parser';
// Create a new express application
const app = express();


app.use(cookieParser(process.env.COOKIE_SECRET));
// Add the necessary routes
app.use('/', authRouter);

app.use('/dashboard', dashRouter);

app.use('/api/v0', apiRouter);

// Create a websocket server on top of this express application

// Start the server
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});