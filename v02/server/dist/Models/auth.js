var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import db from "../Storage/db";
import { AUTH_STMTS, SESSION_STMTS, JWT_SIGN_OPTIONS, SEVEN_DAYS } from "./constants";
export default class AuthModel {
    constructor(data) {
        if (!data) {
            this.email = "NAN";
            this.password = "NAN";
            return;
        }
        this.email = data.email;
        this.password = data.password;
        this.last_sign_in = Date.now();
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get user in database
            const user = db.prepare(AUTH_STMTS.LOGIN).get(this);
            if (!user) {
                throw new Error("No such user exists for this email!");
            }
            return yield bcrypt.compare(this.password, user.password_hash)
                .then((result) => {
                if (!result) {
                    throw new Error("Incorrect password!");
                }
                const session = new SessionModel(user);
                return session.handleSession();
            });
        });
    }
    register() {
        const passwordHash = bcrypt.hashSync(this.password, 10);
        const timestamp = Date.now();
        const user = db.prepare(AUTH_STMTS.REGISTER).get(this.email, passwordHash, timestamp, timestamp);
        if (!user) {
            throw new Error("Could not create user, try again later!");
        }
        const newSession = new SessionModel(user);
        return newSession.handleSession();
    }
}
export class SessionModel {
    constructor(user) {
        this.user = user;
    }
    handleSession() {
        const activeSession = db.prepare(SESSION_STMTS.FIND).get(this.user);
        const accessToken = jwt.sign({ 'id': this.user.id }, process.env.TOKEN_SECRET, JWT_SIGN_OPTIONS);
        // Session not expired yet?
        if (activeSession && activeSession.expires_at > Date.now()) {
            db.prepare(SESSION_STMTS.REFRESH).run(accessToken, activeSession.id);
            const refreshToken = activeSession.refresh_token;
            return { refreshToken, accessToken };
        }
        const refreshToken = crypto.randomBytes(64).toString('utf8');
        const timestamp = Date.now();
        const expiry = timestamp + SEVEN_DAYS;
        db.prepare(SESSION_STMTS.CREATE).run(this.user.id, refreshToken, accessToken, timestamp, expiry);
        return { refreshToken, accessToken };
    }
}
export function findUser(id) {
    const user = db.prepare(SESSION_STMTS.FIND).get({ id: id });
    if (!user) {
        throw new Error("Could not retrieve user!");
    }
    return user;
}
