"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_STMTS = exports.AUTH_STMTS = exports.SEVEN_DAYS = exports.JWT_SIGN_OPTIONS = void 0;
exports.JWT_SIGN_OPTIONS = {
    expiresIn: "1h",
};
exports.SEVEN_DAYS = 604800;
exports.AUTH_STMTS = {
    LOGIN: `
        SELECT *
        FROM users
        WHERE email = @email 
    `,
    REGISTER: `
        INSERT INTO users (email, password_hash, created_at, last_sign_in)
        VALUES (?, ?, ?, ?)
        RETURNING *
    `,
};
exports.SESSION_STMTS = {
    CREATE: `
        INSERT INTO sessions (user_id, refresh_token, access_token, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?)
        RETURNING *
    `,
    FIND: `
        SELECT *
        FROM sessions
        WHERE user_id = @id
        ORDER BY expires_at DESC 
        LIMIT 1;
    `,
    REFRESH: `
        UPDATE sessions
        SET access_token = ?
        WHERE id = ?
    `
};
//# sourceMappingURL=constants.js.map