// This will be extremly simple, all I need to do is create a model for users for when someone wants to add them to a group.
// Therefore, the only info I need to return is given the id, if the user exists, and what their email is.
import { Model } from "./model";

export default class UserModel extends Model {

    async get_serialize() {
        const jsonObject = {
            'id': this.data.id,
            'email': this.data.email
        }
        return JSON.stringify(jsonObject);
    }

}

