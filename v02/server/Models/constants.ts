import { SignOptions } from "jsonwebtoken"

export const JWT_SIGN_OPTIONS : SignOptions = {
    expiresIn: "1h",
}

export const SEVEN_DAYS : number = 604800;


export const AUTH_STMTS = {
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
}

export const SESSION_STMTS = {
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
}