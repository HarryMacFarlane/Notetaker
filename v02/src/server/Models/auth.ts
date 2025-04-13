import bcrypt from "bcrypt";
import crypto from "node:crypto"
import jwt from "jsonwebtoken";
import db from "../Storage/db";
import { AUTH_STMTS, SESSION_STMTS, JWT_SIGN_OPTIONS, SEVEN_DAYS } from "./constants";
import { DBSession, DBUser } from "./Schema/index"

export interface authData {
    email: string;
    password: string;
}

export default class AuthModel {
    email : string;
    password : string;
    id? : number;
    last_sign_in? : number;

    constructor(data : authData | null) {
        if (!data) {
            this.email = "NAN";
            this.password = "NAN";
            return
        }
        this.email = data.email;
        this.password = data.password;
        this.last_sign_in = Date.now();
    }

    async login() : Promise<{ refreshToken : string, accessToken : string }> {
        // Get user in database
        const user = db.prepare<AuthModel,DBUser>(AUTH_STMTS.LOGIN).get(this);
        if (!user) {
            throw new Error("No such user exists for this email!");
        }

        return await bcrypt.compare(this.password, user.password_hash)
        .then(
            (result) => {
                if (!result) {
                    throw new Error("Incorrect password!");
                }
                const session : SessionModel = new SessionModel(user);
                return session.handleSession();
            }
        )
    }

    register() : { refreshToken : string, accessToken : string } {
        const passwordHash : string = bcrypt.hashSync(this.password, 10);
        const timestamp : number = Date.now();
        const user : DBUser | undefined = db.prepare<[string, string, number, number],DBUser>(AUTH_STMTS.REGISTER).get(this.email, passwordHash, timestamp, timestamp);
        if (!user) {
            throw new Error("Could not create user, try again later!");
        }
        const newSession = new SessionModel(user);
        return newSession.handleSession();
    }   

}

export class SessionModel {
    user : DBUser
    constructor(user : DBUser) {
        this.user = user;
    }

    handleSession() : { refreshToken : string, accessToken : string } {
        const activeSession : DBSession | undefined = db.prepare<[DBUser], DBSession>(SESSION_STMTS.FIND).get(this.user);

        const accessToken = jwt.sign({'id': this.user.id}, process.env.TOKEN_SECRET, JWT_SIGN_OPTIONS);

        // Session not expired yet?
        if (activeSession && activeSession.expires_at > Date.now()) {

            db.prepare(SESSION_STMTS.REFRESH).run(accessToken, activeSession.id);
            
            const refreshToken = activeSession.refresh_token;

            return { refreshToken, accessToken }
        }

        const refreshToken : string = crypto.randomBytes(64).toString('utf8');

        const timestamp = Date.now();

        const expiry = timestamp + SEVEN_DAYS;

        db.prepare(SESSION_STMTS.CREATE).run(this.user.id, refreshToken, accessToken, timestamp, expiry);

        return { refreshToken, accessToken }
    }
}

export function findUser(id : number) : DBUser {
    const user : DBUser | undefined = db.prepare<[{id : number}], DBUser>(SESSION_STMTS.FIND).get({id: id});

    if (!user) {
        throw new Error("Could not retrieve user!");
    }

    return user;
}