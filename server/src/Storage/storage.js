import Database from 'better-sqlite3';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';


class dbRunner {
    constructor(environment) {
        // CHANGE THIS TO CREATE OR ACCESS THE DATABAS FROM WHEREVER NECESSARY!
        this.db = new Database(`./server/src/Storage/notetaker_${environment}.db`);
    }

    createSession(userID) {
        try {
            let refreshToken = crypto.randomBytes(64).toString('hex');
            // Make sure the refresh token is unique!!!
            refreshLoop: while (true) {
                const session = this.db.prepare('SELECT * FROM sessions WHERE refresh_token = ?').get(refreshToken);
                if (!session) {
                    break refreshLoop;
                }
                refreshToken = crypto.randomBytes(64).toString('hex');
            }
            const accessToken = jsonwebtoken.sign({ userID }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const stmt = this.db.prepare('INSERT INTO sessions (user_id, refresh_token, access_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?)');
            stmt.run(userID, refreshToken, accessToken, Date.now(), Date.now() + (60 * 60 * 24 * 7));
            return { refreshToken, accessToken };
        }
        catch (error) {
            throw error;
        }
    }

    refreshSession(refreshToken) {
        try {
            const session = this.db.prepare('SELECT * FROM sessions WHERE refresh_token = ?').get(refreshToken);
            if (!session) {
                throw new Error('Invalid refresh token');
            }
            else if (session.expires_at < Date.now()) {
                throw new Error('Refresh token expired');
            }
            const accessToken = jsonwebtoken.sign({ userID: session.user_id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
            const stmt = this.db.prepare('UPDATE sessions SET access_token = ? WHERE id = ?')
            stmt.run(accessToken, session.id);
            return accessToken;
        }
        catch (error) {
            throw error;
        }
    }

    async register(email, password) {
        try {
            const passwordHash = await bcrypt.hashSync(password, 10);
            const stmt = this.db.prepare('INSERT INTO users (email, password_hash, created_at) VALUES (?, ?, ?)');
            stmt.run(email, passwordHash, Date.now());

            // Make sure we can now get our user id to create the subsequent session
            const userID = await this.db.prepare('SELECT id FROM users WHERE email = ?').get(email).id;
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