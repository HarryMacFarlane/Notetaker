import { Data } from "./data"
import UserGroupData from "./userGroups";
export default interface UserData extends Data {
    email: string;
    password_hash: string;
    created_at: number;
    last_session: number | null;
    groups? : UserGroupData;
}