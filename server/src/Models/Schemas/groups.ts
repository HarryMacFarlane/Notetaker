import { Data } from "./data"
import UserGroupData from "./userGroups";
import DocumentGroupsData from "./documentGroups";

export default interface GroupData extends Data {
    name : string;
    description : string;
    created_at : number;
    last_action : number;
    users? : UserGroupData;
    documents? : DocumentGroupsData
}