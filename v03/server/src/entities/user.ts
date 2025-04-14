import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export default class User {
    @Field(() => String)
    @PrimaryKey({ type: "uuid"})
    id?: string = uuid();

    @Field(() => String,)
    @Property({ type: "character varying", length: 255, unique: true})
    email!: string;

    @Property({ type: "character varying", length: 255})
    password!: string;

    @Field(() => String)
    @Property({ onCreate: () => new Date, type: "date", default: 'NOW()'})
    created_at?: Date;

    @Field(() => String)
    @Property({ onCreate: () => new Date, onUpdate: () => new Date, type: "date", default: 'NOW()'})
    last_sign_in?: Date
}
