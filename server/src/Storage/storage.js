import Database from 'better-sqlite3';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import * as constants from './constants.js';

// Constants (create seperate file for these in the future)

class dbRunner {
    constructor(environment) {
        // CHANGE THIS TO CREATE OR ACCESS THE DATABAS FROM WHEREVER NECESSARY!
        this.db = new Database(`./server/src/Storage/notetaker_${environment}.db`);
    }

    createSession(userID) {
        // Check if a session already exists, and if it does, return that instead!
        const session = this.db.prepare(constants.FIND_ACTIVE_SESSION).get(userID);
        
        if (session) {
            try {
                const email = this.db.prepare(constants.USER_FROM_ID_STMT).get(userID).email;
                this.refreshSession(email, session.refresh_token);
            }
            catch (e) {
                console.log(`Failed to refresh the session(${session.id}). Creating a new one...`)
            }
        }

        const refreshToken = crypto.randomBytes(64).toString('utf8')
        const accessToken = jwt.sign(
            { userID },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: constants.JWT_SIGN_DURATION },
        );
        const time = Date.now();
        const stmt = this.db.prepare(constants.CREATE_SESSION_STMT);
        stmt.run(userID, refreshToken, accessToken, time, (time + constants.SEVEN_DAYS))
        const timestamp = time + constants.THIRTY_MINUTES;
        return { refreshToken, accessToken, timestamp };
    }

    refreshSession(email, refreshToken) {
        const user = this.db.prepare(constants.USER_FROM_EMAIL_STMT).get(email);
        if (!user) {
            throw Error('User does not exist for this email!');
        }
        const session = this.db.prepare(constants.SESSION_FROM_USERID_AND_REFRESH_TOKEN).get(user.id, refreshToken);
        if (!session) {
            throw new Error('Invalid refresh token');
        }
        else if (session.expires_at < Date.now()) {
            throw new Error('Refresh token expired');
        }
        const accessToken = jsonwebtoken.sign(
            { userID: session.user_id }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: constants.JWT_SIGN_DURATION }
        );
        
        const timestamp = Date.now() + constants.THIRTY_MINUTES;
        
        this.db.prepare(constants.UPDATE_ACCESS_TOKEN).run(accessToken, timestamp, session.id);

        return { refreshToken, accessToken, timestamp };
    }

    async register(email, password) {
        return await bcrypt.hash(password, 10)
                .then(
                    (passwordHash) => {
                        const stmt = this.db.prepare(constants.CREATE_USER_STMT);
                        const date = Date.now();
                        const info = stmt.run(email, passwordHash, date, date);
                        const userID = this.db.prepare(constants.USER_FROM_EMAIL_STMT).get(email).id;
                        return this.createSession(userID);
                    }
                )
                .catch(
                    (e) => {
                        console.error(e);
                        throw Error('There was a problem on our end. Try again later!') // REPLACE THIS WITH CHECKS FOR WHY IT FAILED
                    }
                )
    }

    async login(email, password) {
        const user = this.db.prepare(constants.USER_FROM_EMAIL_STMT).get(email);
        if (!user) {
            throw Error('No account associated with this email.'); // REPLACE WITH CODE 404 (not found)
        }
        return await bcrypt.compare(password, user.password_hash)
            .then(
                (valid) => {
                    if (valid) {
                        return this.createSession(user.id);
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
}
// UPDATE THIS IN THE FUTURE TO DEFINE THE NODE ENV AND USE THAT INSTEAD TO ACCESS THE DB
export default new dbRunner('dev');