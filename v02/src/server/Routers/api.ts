import express from "express";
import { authenticateUser } from "./auth";

const ApiRouter = express.Router();

ApiRouter.use(authenticateUser);

// Here, we simply configure the ApiRouter to use the route collection from the appropriate version.

export default ApiRouter;