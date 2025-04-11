import { DBEntry } from "./interface";

export default interface DBSession extends DBEntry {
    user_id : string;
    refresh_token : string;
    access_token : string;
    created_at : number;
    expires_at : number;
}