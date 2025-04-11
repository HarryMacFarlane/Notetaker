import { Data } from "./data"

export default interface SessionData extends Data {
    user_id: number;
    refresh_token: string;
    access_token: string;
    created_at: number;
    expires_at: number;
}