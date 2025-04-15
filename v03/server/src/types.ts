import { EntityManager, IDatabaseDriver, Connection } from "@mikro-orm/core"
import { Request, Response, } from "express"
import { BaseContext } from "@apollo/server"
import { SessionData } from "express-session"

declare module 'express-session' {
    interface SessionData {
        userID?: string;
    }
}

export interface MyContext extends BaseContext {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    req : Request & { session: SessionData }
    res : Response
}