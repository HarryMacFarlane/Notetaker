export const USER_FROM_EMAIL_STMT='SELECT * FROM users WHERE email = ?';
export const CREATE_USER_STMT = 'INSERT INTO users (email, password_hash, created_at, last_sign_in) VALUES (?, ?, ?, ?)';
export const CREATE_SESSION_STMT = 'INSERT INTO sessions (user_id, refresh_token, access_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?)';
export const SESSION_FROM_USERID_AND_REFRESH_TOKEN = 'SELECT * from sessions WHERE user_id = ? AND refresh_token = ?';
export const UPDATE_ACCESS_TOKEN = 'UPDATE sessions SET access_token = ? AND last_refresh = ? WHERE id = ?';
export const FIND_ACTIVE_SESSION = 'SELECT * FROM sessions WHERE user_id = ?';
export const USER_FROM_ID_STMT="SELECT * FROM users WHERE id = ?";
export const ACTIVE_SESSION_STMT="";
export const SEVEN_DAYS = 604800;
export const THIRTY_MINUTES = 1800;
export const JWT_SIGN_DURATION = "30m";