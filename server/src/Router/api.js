import express from 'express';
import cookieParser from 'cookie-parser';
import { authController, userController, groupController, docController } from '../Controllers/index.js';

import 'dotenv/config.js';

// Create a new express router
const apiRouter = express.Router();
 
// Add the necessary middleware
apiRouter.use(cookieParser(process.env.COOKIE_SECRET)); // ADD SOME SECRET FOR COOKIE PARSING !!!!!!
apiRouter.use(express.json());
apiRouter.use(authController.authenticateUser); // Authenticate user before allowing access to the API

// Define a couple of ressources, as well as the controllers for these resources...
apiRouter.get('/users/:id', userController.get);

// DOCUMENTS resources
// apiRouter.get('/docs', docController.index);
// apiRouter.get('/docs/:id', docController.get);
// apiRouter.post('/docs', docController.post);
// apiRouter.patch('/docs/:id', docController.patch);
// apiRouter.delete('/docs/:id', docController.delete);

// GROUPS resources
apiRouter.get('/groups', groupController.index);
apiRouter.get('/groups/:id', groupController.get);
apiRouter.post('/groups', groupController.post);
apiRouter.patch('/groups/:id', groupController.patch);
apiRouter.delete('/groups/:id', groupController.delete);

export default apiRouter;