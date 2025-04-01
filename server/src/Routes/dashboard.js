import express from 'express';

const dashRouter = express.Router();


dashRouter.get("/", (req, res) => {
    res.send("<h1> Provide the index.html file here in the future! </h1>")
})

export default dashRouter;