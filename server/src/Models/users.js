// This will be extremly simple, all I need to do is create a model for users for when someone wants to add them to a group.
// Therefore, the only info I need to return is given the id, if the user exists, and what their email is.
import { Model } from "./model.js";
import { USER_STATEMENTS, SESSION_STATEMENTS, THIRTY_MINUTES, SEVEN_DAYS, JWT_SIGN_DURATION} from "./constants.js";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { db } from "../Storage/storage.js";

export default class UserModel extends Model {

    // ADD A CHECK HERE MAYBE? JUST TO ENSURE A UNQIUE VALUE
    constructor(data) {
        super(data);
    }

    handleSession(id) {
        // Check if a session already exists, and if it does, return that instead!
        const session = db.prepare(SESSION_STATEMENTS.FIND).get(id);
        // Prepare a new accessToken regardless
        const accessToken = jwt.sign(
            { id: id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: JWT_SIGN_DURATION },
        );
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const timestamp = decoded.exp;

        if (session && session.expires_at > Date.now()) {   
            db.prepare(SESSION_STATEMENTS.REFRESH).run(accessToken, decoded.iat, session.id);
            return { refreshToken: session.refresh_token, accessToken, timestamp }
        }

        const refreshToken = crypto.randomBytes(64).toString('utf8');
        db.prepare(SESSION_STATEMENTS.CREATE).run(id, refreshToken, accessToken, decoded.iat, (decoded.iat + SEVEN_DAYS));
        return { refreshToken, accessToken, timestamp };
    }

    async login() {
        const user = db.prepare(USER_STATEMENTS.LOGIN).get(this.data.email);
        if (!user) {
            throw Error('No account associated with this email.'); // REPLACE WITH CODE 404 (not found)
        }
        return await bcrypt.compare(this.data.password, user.password_hash)
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
            (e) => {
                    throw e; // Handle internal logic inside of createSession method...
                }
        )
    }

    async register() {
        return await bcrypt.hash(this.data.password, 10)
                .then(
                    (passwordHash) => {
                        const date = Date.now();
                        const info = db.prepare(USER_STATEMENTS.REGISTER).run(this.data.email, passwordHash, date, date);
                        return this.handleSession(info.lastInsertRowid);
                    }
                )
                .catch(
                    (e) => {
                        console.error(e);
                        throw Error('There was a problem on our end. Try again later!') // REPLACE THIS WITH CHECKS FOR WHY IT FAILED
                    }
                )
    }

    async get_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'email': this.data.email
        }
        return JSON.stringify(jsonObject);
    }

}

