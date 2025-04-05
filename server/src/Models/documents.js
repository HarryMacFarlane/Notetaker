import { Model } from './model.js'

export default class DocModel {
    index_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name
        }
        return JSON.stringify(jsonObject);
    }
    get_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name,
            'content': this.data.content,
            'created_at': this.data.created_at,
            'last_modified': this.data.last_modified
        }
        return JSON.stringify(jsonObject);

    }
    post_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'name': this.data.name
        }
        return JSON.stringify(jsonObject);
    }
}