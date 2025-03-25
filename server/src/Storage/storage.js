import Database from 'better-sqlite3';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';


class dbRunner {
    constructor(environment) {
        this.db = new Database(`./server/src/Storage/notetaker_${environment}.db`);
    }

    createSession(userID) {
        try {
            const refreshToken = crypto.randomBytes(64).toString('hex');
            // Make sure the refresh token is unique!!!
            while (true) {
                // UPDATE THIS FOR LATER!!!!
                break;
            }
            const accessToken = jsonwebtoken.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const stmt = this.db.prepare('INSERT INTO sessions (user_id, refreshToken, accessToken, created_at, last_refresh) VALUES (?, ?, ?, ?, ?)');
            stmt.run(userID, refreshToken, accessToken, Date.now(), Date.now());
            return { refreshToken, accessToken };
        }
        catch (error) {
            throw error;
        }
    }

    refreshSession(refreshToken) {
        try {
            const session = this.db.prepare('SELECT * FROM sessions WHERE refreshToken = ?').get(refreshToken);
            if (!session) {
                throw new Error('Invalid refresh token');
            }
            else if (session.created_at + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
                throw new Error('Refresh token expired');
            }
            const accessToken = jsonwebtoken.sign({ userID: session.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const stmt = this.db.prepare('UPDATE sessions SET access_token = ?, last_refresh = ? WHERE id = ?')
            stmt.run(accessToken, Date.now(), session.id);
            return accessToken;
        }
        catch (error) {
            throw error;
        }
    }

    register(email, password) {
        try {
            const passwordHash = bcrypt.hashSync(password, 10);
            const stmt = this.db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
            stmt.run(email, passwordHash);

            // Make sure we can now get our user id to create the subsequent session
            const userID = this.db.prepare('SELECT id FROM users WHERE email = ?').get(email).id;
            return this.createSession(userID);
        }
        catch (error) {
            throw error;
        }
    }

    login(email, password) {
        const user = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        if (!bcrypt.compareSync(password, user.password)) {
            throw new Error('Invalid email or password');
        }
        return this.createSession(user.id);
    }
}
// UPDATE THIS IN THE FUTURE TO DEFINE THE NODE ENV AND USE THAT INSTEAD TO ACCESS THE DB
export default new dbRunner('dev');