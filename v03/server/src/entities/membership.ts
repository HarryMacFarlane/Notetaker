import { Entity, ManyToOne, PrimaryKey, Property, Enum} from "@mikro-orm/core";
import { v4 as uuid } from "uuid";
import { ObjectType, Field, EnumResolver } from "type-graphql";
import Group from "./group";
import User from "./user";

@ObjectType()
@Entity()
export default class Membership {

    @Field(() => String)
    @PrimaryKey({ type: "uuid"})
    id?: string = uuid();

    @Field(() => Group)
    @ManyToOne(() => Group)
    group!: Group;

    @Field(() => User)
    @ManyToOne(() => User)
    member!: User;

    @Field(() => String)
    @Enum(() => UserRole)
    role!: UserRole;

    @Field(() => Date)
    @Property({ onCreate: () => new Date, type: "date", default: 'NOW()'})
    joined_at?: Date

    @Field(() => Date)
    @Property({ onCreate: () => new Date, onUpdate: () => new Date, type: "date", default: 'NOW()'})
    last_action?: Date
    
}

export enum UserRole {
    READER = "reader",
    EDITOR = "editor",
    ADMIN = "admin"
}