import { SignOptions } from "jsonwebtoken"

export const JWT_SIGN_OPTIONS : SignOptions = {
    expiresIn: "1h",
} as const;

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
} as const;

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
} as const;

export const GROUP_STMTS = {
    INDEX_DOC: `
        SELECT g.id, g.name, g.description
        FROM documentgroups dg
        JOIN groups g
        ON dg.group_id = g.id
        WHERE dg.doc_id = ?
    `,
    INDEX_USER: `
        SELECT g.id, g.name, g.decription, ug.role
        FROM groups g
        JOIN usergroups ug
        ON g.id = ug.group_id
        WHERE ug.user_id = ?
    `,
    GET: `
        SELECT *
        FROM groups
        WHERE id = ?
    `,
    POST: `
        INSERT INTO groups (name, description, created_at, owner)
        VALUES (@name, @description, @created_at, @owner)
    `,
    PATCH: `
        UPDATE groups
        SET 
        WHERE id = ?` 
    ,
    DELETE: `
        DELETE groups
        WHERE id = ?
    `
} as const;

export const USER_GROUP_STMTS = {
    ADD: `
        INSERT INTO usergroups (user_id, group_id, role)
        VALUES (?, ?, ?)
    `,
    REMOVE: `
        DELETE usergroups
        WHERE user_id = ? AND group_id = ?
    `,
    DELETE_USER: `
        DELETE usergroups
        WHERE user_id = ?
    `,
    DELETE_GROUP: `
        DELETE usergroups
        WHERE group_id = ?
    `
} as const;

export const DOC_GROUP_STATEMENTS = {
    ADD: `
        INSERT INTO documentgroups (doc_id, group_id)
        VALUES (?, ?)
    `,
    REMOVE: `
        DELETE documentgroups
        WHERE doc_id = ? AND group_id = ?
    `,
    DELETE_DOC: `
        DELETE documentgroups
        WHERE doc_id = ?
    `,
    DELETE_GROUP: `
        DELETE documentgroups
        WHERE
    `
} as const