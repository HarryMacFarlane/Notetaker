import {SignOptions} from 'jsonwebtoken';

export const SEVEN_DAYS : number = 604800;
export const THIRTY_MINUTES : number = 1800;
export const JWT_SIGN_DURATION : string = "30m";

export const JWT_SIGN_OPTIONS : SignOptions = { expiresIn: "30m" }


interface TableStatements {
    index: string;
    get: string;
    post: string;
    patch: string | Function;
    delete: string | Function;
}

interface AuthStatements {
    FIND_EMAIL: string;
    FIND_ID: string;
    REGISTER: string;
    LOGIN: string;
}

export const USER_STATEMENTS : AuthStatements = {
    FIND_EMAIL: `
        SELECT *
        FROM users
        WHERE email = ?
    `,
    FIND_ID: `
        SELECT *
        FROM users
        WHERE id = ?
    `,
    REGISTER: `
        INSERT INTO Users (email, password_hash, created_at, last_sign_in) 
        VALUES (?, ?, ?, ?)
    `,
    LOGIN: `
        SELECT *
        FROM users
        WHERE email = ?
    `,
}

interface SessionStatements {
    FIND: string;
    CREATE: string;
    REFRESH: string;
}

export const SESSION_STATEMENTS : SessionStatements = {
    FIND: `
        SELECT * 
        FROM sessions
        WHERE user_id = ? 
        ORDER BY expires_at DESC 
        LIMIT 1;
    `,
    CREATE: `
        INSERT INTO sessions (user_id, refresh_token, access_token, created_at, expires_at)
        VALUES (?, ?, ?, ?, ?)
    `,
    REFRESH: `
        UPDATE sessions
        SET access_token = ?, last_refresh = ?
        WHERE id = ?
    `
}

export const DOC_STATEMENTS : TableStatements = {
    index: `SELECT 
        FROM documents d
        JOIN documentgroups ON d.
        WHERE d.creator = ?
    `,
    get: `
        SELECT 
        d.*, 
        (
            SELECT GROUP_CONCAT(DISTINCT dg.group_id)
            FROM DocumentGroups dg
            WHERE dg.document_id = d.id
        ) AS groups,
        (
            SELECT json_group_array(json_object('user_id', ug.user_id, 'role', ug.role))
            FROM usergroups ug
            WHERE ug.group_id IN (
            SELECT dg2.group_id
            FROM DocumentGroups dg2
            WHERE dg2.document_id = d.id
            )
        ) AS users
        FROM documents d
        WHERE d.creator = ?
    `,
    post: `
        INSERT INTO documents (name, description, content, last_modified, created_at, creator) 
        VALUES (@name, @description, @content, @last_modified, @created_at, @creator)
    `,
    patch: ``,
    delete: "DELETE Groups WHERE id = ?"
}

export const GROUP_STATEMENTS : TableStatements = {
    index: `
        SELECT g.id, g.name, g.description
        FROM usergroups ug
        JOIN groups g ON ug.group_id = g.id
        WHERE ug.user_id = ?
    `
    ,
    get: `
        SELECT g.*
        FROM groups g
        WHERE g.id = ?
    `,
    post: `
        INSERT INTO Groups (name, description, created_at, last_action)
        VALUES (@name, @description, @created_at, @last_action)
        RETURNING id
        `,
    patch: ``,
    delete: "DELETE Groups WHERE id = ?"
}

export const USER_GROUP_STATEMENTS : TableStatements = {
    get: `
        SELECT ug.user_id as id, ug.role as role, u.email as email
        FROM UserGroups ug
        JOIN Users g ON g.id = ug.user_id
        WHERE ug.group_id = ?
    `,
    index: `
        SELECT group_id
        FROM UserGroups
        WHERE ? = ?
    `
    ,
    post: `
        INSERT INTO UserGroups (group_id, user_id, role)
        VALUES (?,?,?)
    `
    ,
    patch: `
        UPDATE UserGroups
        SET role = @role
        WHERE group_id = @group_id, user_id = @user_id
    `
    ,
    // Maybe add another statement here to allow to delete all users associated with a group when its destroyed?
    delete: `
        DELETE UserGroups
        WHERE group_id = ? AND user_id = ?
    `

}

export const DOC_GROUP_STATEMENTS : TableStatements = {
    get: `
        SELECT dg.doc_id as id, d.name as name, d.description as description
        FROM DocumentGroups dg
        JOIN Documents d ON d.id = dg.doc_id
        WHERE dg.group_id = ?
    `,
    index: `
        SELECT dg.group_id, g.name
        FROM DocumentGroups dg
        JOIN Groups g
        ON g.id = dg.group_id
        WHERE dg.doc_id = ?  
    `,
    post: `
        INSERT INTO DocumentGroups (doc_id, group_id)
        VALUES (@docID, @groupID)
    `,
    patch: `
        SELECT 

    `,
    delete: (deleteType: string) => {
        if (deleteType === "doc") {
            return `
                DELETE DocumentGroups
                WHERE doc_id = ?`
        }
        else if (deleteType === "group") {
            return `
                DELETE DocumentGroups
                WHERE group_id = ?
            `
        }
        else {
            return `
                DELETE DocumentGroups
                WHERE group_id = @group_id AND doc_id = @doc_id
            `
        }
    }
}