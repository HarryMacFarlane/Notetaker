import { Model, Data } from "./model.js";
import { db } from "../Storage/storage.js";
import { GROUP_STATEMENTS, USER_GROUP_STATEMENTS, DOC_GROUP_STATEMENTS } from "./constants.js";
import { json } from "express";


interface GroupData extends Data {
    id: number | null;
    name: string | null;
    description: string | null;
    created_at: number | null;
    creator: number | null;
    users: [
        {
            id: number,
            email: string
        }
    ];
    documents: [
        {
            id: number,
            name: string
        }
    ]
}

export default class GroupModel implements Model {
    data : GroupData;

    constructor(pData : GroupData) {
        this.data = pData;
    }

    index_serialize({number : id}) {
        const groupData = db.prepare(GROUP_STATEMENTS.index).run(id);

        return JSON.stringify(groupData);
    }


    // Used to get the data for an id stored in data
    get_serialize() {
        const groupData = db.prepare(GROUP_STATEMENTS.get).get(this.data.id);
        const userData = db.prepare(USER_GROUP_STATEMENTS.get).all(this.data.id);
        const docData = db.prepare(DOC_GROUP_STATEMENTS.get).all(this.data.id);

        const jsonObject = {
            ...groupData,
            users: [...userData],
            documents: [...docData]
        }

        console.log(jsonObject);

        return JSON.stringify(jsonObject);
    }

    post_serialize() {
        const groupData = db.prepare(GROUP_STATEMENTS.post).run(this.data)

        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
        }

        return JSON.stringify(jsonObject)
    }

    patch_serialize(): String {
        throw new Error('Method not implemented.');
    }
    delete_serialize(): String {
        throw new Error('Method not implemented.');
    }
}