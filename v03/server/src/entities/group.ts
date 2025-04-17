import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { v4 as uuid } from "uuid";
import { ObjectType, Field } from "type-graphql";
import Membership from "./membership";

@ObjectType()
@Entity()
export default class Group {

    @Field(() => String)
    @PrimaryKey({ type: "uuid"})
    id?: string = uuid();

    @Field(() => String,)
    @Property({ type: "character varying", length: 255 })
    name!: string;
    
    @Field(() => String)
    @Property({ type: "character varying", length: 1000})
    description!: string;

    @Field(() => Date)
    @Property({ onCreate: () => new Date, type: "date", default: 'NOW()'})
    created_at?: Date;

    @Field(() => [Membership])
    @OneToMany({ mappedBy : 'group', entity: () => Membership })
    memberships = new Collection<Membership>(this);

}