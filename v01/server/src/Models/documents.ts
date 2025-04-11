import { LargeNumberLike } from "crypto";
import { DocumentData } from "./Schemas/index";
import { Model } from "./model";



interface DocReqData {
    user_id? : number;
    doc_id? : number;
    group_id? : number;
}

export default class DocModel implements Model {

    data : DocReqData;

    constructor(data: DocReqData) {
        this.data = data;
    }

    index_serialize() : string {
        throw new Error('Method not implemented.');
    }
    get_serialize() : string {
        throw new Error('Method not implemented.');
    }
    post_serialize() : string {
        throw new Error('Method not implemented.');
    }
    patch_serialize(): string {
        throw new Error('Method not implemented.');
    }
    delete_serialize(): string {
        throw new Error('Method not implemented.');
    }
}