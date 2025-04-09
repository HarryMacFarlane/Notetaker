export const SEVEN_DAYS = 604800;
export const THIRTY_MINUTES = 1800;
export const JWT_SIGN_DURATION = "30m";


export const USER_STATEMENTS = {
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

export const SESSION_STATEMENTS = {
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

export const DOC_STATEMENTS = {
    index: `SELECT 
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
    get: `SELECT *
        FROM documents
        WHERE id = ?
    `,
    post: `
        INSERT INTO documents (name, description, content, last_modified, created_at, creator) 
        VALUES (@name, @description, @content, @last_modified, @created_at, @creator)
    `,
    patch: ({name, description, content, last_modified}) => {
        let set = "";
        if (name) {
            set = `name = ${name}, `
        }
        if (description) {
            set += `description = ${description}, `
        }
        if (content) {
            set += `content = ${content}, `
        }
        if (last_modified) {
            set += `last_action = ${last_modified}`
        }

        return `
            UPDATE Groups SET ${set} WHERE id = ?
        `
    },
    delete: "DELETE Groups WHERE id = ?"
}

export const GROUP_STATEMENTS = {
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
    patch: ({ name, description, last_action }) => {
        let set = ""
        if (name) {
            set = `name = @name, `
        }
        if (description) {
            set += `description = @description, `
        }
        if (last_action) {
            set += `last_action = @last_action`
        }
        
        return `
                UPDATE Groups SET ${set}, WHERE id = ?
            `
    },
    delete: "DELETE Groups WHERE id = ?"
}

export const USER_GROUP_STATEMENTS = {
    get: `
    SELECT ug.user_id as id, ug.role as role, u.email as email
    FROM UserGroups ug
    JOIN Users g ON g.id = ug.user_id
    WHERE ug.group_id = ?
    `,

}

export const DOC_GROUP_STATEMENTS = {
    get: `
    SELECT dg.doc_id as id, d.name as name, d.description as description
    FROM DocGroups dg
    JOIN Documents d ON d.id = dg.doc_id
    WHERE dg.group_id = ?
    `
}