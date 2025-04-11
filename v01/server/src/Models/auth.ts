import { USER_STATEMENTS, SESSION_STATEMENTS, SEVEN_DAYS, JWT_SIGN_OPTIONS } from "./constants";
import dotenv from 'dotenv'; 
dotenv.config();
import jwt, {JwtPayload, Secret } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from "../Storage/storage.js";
import { assert } from "console";
import { UserData, SessionData } from "./Schemas/index"

export interface authData {
    email: string;
    password: string;
}

export default class AuthModel {

    email : string;
    password : string;
    // ADD A CHECK HERE MAYBE? JUST TO ENSURE A UNQIUE VALUE
    constructor(data : authData) {
        this.email = data.email;
        this.password = data.password;
    }

    handleSession(id : number) : {refreshToken : string , accessToken : string , timestamp : number }{

        const secret : Secret = process.env.ACCESS_TOKEN_SECRET;

        assert(true, id != null);
        
        // Check if a session already exists, and if it does, return that instead!
        const sessionStatement = db.prepare<[number],SessionData>(SESSION_STATEMENTS.FIND);
        const session = sessionStatement.get(id)
        // Prepare a new accessToken regardless
        const accessToken = jwt.sign(
            { id: id },
            secret,
            JWT_SIGN_OPTIONS,
        );
        const decoded : JwtPayload = jwt.verify(accessToken, secret, { complete: true });

        if (!decoded.exp || !decoded.iat) {
            throw new Error('Issue recovering timestamps for token generation!');
        }

        const timestamp : number = decoded.exp;

        if (session && session.expires_at > Date.now()) {   
            db.prepare<[string, number, number], SessionData>(SESSION_STATEMENTS.REFRESH).run(accessToken, decoded.iat, session.id);
            return { refreshToken: session.refresh_token, accessToken, timestamp }
        }

        const refreshToken = crypto.randomBytes(64).toString('utf8');
        db.prepare<[number, string, string, number, number], SessionData>(SESSION_STATEMENTS.CREATE).run(id, refreshToken, accessToken, decoded.iat, (decoded.iat + SEVEN_DAYS));
        return { refreshToken, accessToken, timestamp };
    }

    async login() : Promise<{ refreshToken : string, accessToken : string, timestamp : number }> {
        const user = db.prepare<[string], UserData>(USER_STATEMENTS.LOGIN).get(this.email);
        if (!user) {
            throw Error('No account associated with this email.'); // REPLACE WITH CODE 404 (not found)
        }
        // Need to make sure this goes before we handle the session...

        return await bcrypt.compare(this.password, user.password_hash)
        .then(
            (valid) => {
                if (valid) {
                    return this.handleSession(user.id);
                }
                else {
                    throw Error('Email or password is incorrect! Please try again.') // REPLACE WITH CODE 401 (unauthorized)
                }
            }
        )
        .catch(
            (e : Error) => {
                    throw e; // Handle internal logic inside of createSession method...
                }
        )
    }

    async register() : Promise<{ refreshToken : String, accessToken : String, timestamp : number }> {
        return await bcrypt.hash(this.password, 10)
                .then(
                    (passwordHash) => {
                        const date = Date.now();
                        const info = db.prepare<[string, string, number, number], UserData>(USER_STATEMENTS.REGISTER).get(this.email, passwordHash, date, date);
                        
                        if (!info) {
                            throw new Error('Could not create user based on the following inputs');
                        }

                        return this.handleSession(info.id);
                    }
                )
                .catch(
                    (e) => {
                        console.error(e);
                        throw Error('There was a problem on our end. Try again later!') // REPLACE THIS WITH CHECKS FOR WHY IT FAILED
                    }
                )
    }
}

