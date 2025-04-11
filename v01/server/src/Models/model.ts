
export interface Model {

    index_serialize({number}) : String;

    get_serialize() : String;

    post_serialize() : String;

    patch_serialize() : String;

    delete_serialize() : String;
}

export interface Data {
    id?: number;
}