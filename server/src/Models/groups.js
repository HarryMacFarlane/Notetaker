import { Model } from "./model.js";

export default class GroupModel extends Model {
    get_serialize({members, notes}) {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
            'description': this.description,
            'members': members,
            'created_at': this.data.created_at,
            'last_modified': this.data.last_modified,
            'notes': notes,
        }
        return JSON.stringify(jsonObject);
    }

    async index_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
        }
    }

    async post_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
        }
    }
}