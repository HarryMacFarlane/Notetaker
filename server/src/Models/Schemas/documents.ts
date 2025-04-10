import { Data } from "./data";
import DocGroupData from "./documentGroups"

export default interface DocumentData extends Data {
    name: string;
    description : string;
    content?: string;
    last_modified: number;
    created_at: number;
    creator: number;
    users? : DocGroupData;
}