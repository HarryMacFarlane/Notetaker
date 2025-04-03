import express from 'express';
import cookieParser from 'cookie-parser';
import dbRunner from '../../Storage/storage.js';
// Create a new express router
const apiRouter = express.Router();
 
// Add the necessary middleware
apiRouter.use(cookieParser()); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
apiRouter.use(express.json());

// Define a couple of ressources, as well as the controllers for these resources...

export default apiRouter;