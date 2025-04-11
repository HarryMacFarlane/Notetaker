"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSION_STMTS = exports.AUTH_STMTS = exports.SEVEN_DAYS = exports.JWT_SIGN_OPTIONS = void 0;
exports.JWT_SIGN_OPTIONS = {
    expiresIn: "1h",
};
exports.SEVEN_DAYS = 604800;
exports.AUTH_STMTS = {
    LOGIN: "\n        SELECT *\n        FROM users\n        WHERE email = @email \n    ",
    REGISTER: "\n        INSERT INTO users (email, password_hash, created_at, last_sign_in)\n        VALUES (?, ?, ?, ?)\n        RETURNING *\n    ",
};
exports.SESSION_STMTS = {
    CREATE: "\n        INSERT INTO sessions (user_id, refresh_token, access_token, created_at, expires_at)\n        VALUES (?, ?, ?, ?, ?)\n        RETURNING *\n    ",
    FIND: "\n        SELECT *\n        FROM sessions\n        WHERE user_id = @id\n        ORDER BY expires_at DESC \n        LIMIT 1;\n    ",
    REFRESH: "\n        UPDATE sessions\n        SET access_token = ?\n        WHERE id = ?\n    "
};
