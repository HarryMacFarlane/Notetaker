import express, { Request, Response } from "express";
import { authenticateUser } from "./auth";

const DashRouter = express.Router();

DashRouter.use(authenticateUser);

DashRouter.get("/", (req : Request, res : Response) => {
    res.sendFile("/client/dist/index.js", {root: "./dist"})
});

export default DashRouter;