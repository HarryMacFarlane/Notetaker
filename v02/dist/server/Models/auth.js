"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionModel = void 0;
exports.findUser = findUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../Storage/db"));
const constants_1 = require("./constants");
class AuthModel {
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
    async login() {
        const user = db_1.default.prepare(constants_1.AUTH_STMTS.LOGIN).get(this);
        if (!user) {
            throw new Error("No such user exists for this email!");
        }
        return await bcrypt_1.default.compare(this.password, user.password_hash)
            .then((result) => {
            if (!result) {
                throw new Error("Incorrect password!");
            }
            const session = new SessionModel(user);
            return session.handleSession();
        });
    }
    register() {
        const passwordHash = bcrypt_1.default.hashSync(this.password, 10);
        const timestamp = Date.now();
        const user = db_1.default.prepare(constants_1.AUTH_STMTS.REGISTER).get(this.email, passwordHash, timestamp, timestamp);
        if (!user) {
            throw new Error("Could not create user, try again later!");
        }
        const newSession = new SessionModel(user);
        return newSession.handleSession();
    }
}
exports.default = AuthModel;
class SessionModel {
    constructor(user) {
        this.user = user;
    }
    handleSession() {
        const activeSession = db_1.default.prepare(constants_1.SESSION_STMTS.FIND).get(this.user);
        const accessToken = jsonwebtoken_1.default.sign({ 'id': this.user.id }, process.env.TOKEN_SECRET, constants_1.JWT_SIGN_OPTIONS);
        if (activeSession && activeSession.expires_at > Date.now()) {
            db_1.default.prepare(constants_1.SESSION_STMTS.REFRESH).run(accessToken, activeSession.id);
            const refreshToken = activeSession.refresh_token;
            return { refreshToken, accessToken };
        }
        const refreshToken = node_crypto_1.default.randomBytes(64).toString('utf8');
        const timestamp = Date.now();
        const expiry = timestamp + constants_1.SEVEN_DAYS;
        db_1.default.prepare(constants_1.SESSION_STMTS.CREATE).run(this.user.id, refreshToken, accessToken, timestamp, expiry);
        return { refreshToken, accessToken };
    }
}
exports.SessionModel = SessionModel;
function findUser(id) {
    const user = db_1.default.prepare(constants_1.SESSION_STMTS.FIND).get({ id: id });
    if (!user) {
        throw new Error("Could not retrieve user!");
    }
    return user;
}
//# sourceMappingURL=auth.js.map