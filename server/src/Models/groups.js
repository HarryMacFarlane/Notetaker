import { Model } from "./model.js";
import { db } from "../Storage/storage.js";
import { GROUP_STATEMENTS, USER_GROUP_STATEMENTS, DOC_GROUP_STATEMENTS } from "./constants.js";
import { json } from "express";


export default class GroupModel extends Model {

    index_serialize() {
        const groupData = db.prepare(GROUP_STATEMENTS.index).run(this.data.userID);

        return JSON.stringify(...groupData);
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

    async index_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
            'description': this.data.description
        }
    }

    async post_serialize() {
        const groupData = db.prepare(GROUP_STATEMENTS.post).run(this.data)

        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
        }
    }
}