import express from 'express';

const dashRouter = express.Router();


dashRouter.get("/", (req, res) => {
    const access_token = req.signedCookies.access_token;
    const email = req.signedCookies.email
    if (access_token && email) {
        // MAKE A FUNCTION HERE TO VERIFY THAT THE ACCESS TOKEN IS VALID FOR THE GIVEN USER
    }
    else {
        // IN THIS CASE, WE WOULD NEED TO CHECK SOME OTHER WAY.... 
        // FIGURE THAT PART OUT SOMETIME IN THE FUTURE....
    }
    // ADD SOME LOGIC HERE TO VERIFY THAT THE USER IS SIGNED IN/HAS A VALID ACCESS OR REFRESH TOKEN SOMEWHERE!
    res.send("<h1> Provide the index.html file here in the future! </h1>")
})

export default dashRouter;