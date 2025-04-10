import { Request, Response } from 'express';

export interface AuthRequest extends Request {
    user_id? : number;
}

// I would have used an interface instead, but I'm not using typescript
export default interface APIController {
    index : (req : Request, res : Response) => {};
    get : (req : Request, res : Response) => {};
    post : (req : Request, res : Response) => {};
    patch : (req : Request, res : Response) => {};
    delete : (req : Request, res : Response) => {};
}