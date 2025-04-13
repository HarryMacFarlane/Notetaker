import { DBEntry } from "./interface";

export default interface DBUser extends DBEntry {
    email : string;
    password_hash : string;
    created_at : number;
    last_sign_in : number;
}