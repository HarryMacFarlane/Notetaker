import { Resolver, Ctx, Query, Mutation, ObjectType, Field, Arg, InputType } from "type-graphql";
import { MyContext } from "src/types";
import { Group, Membership, User } from "../entities";
import { UserRole } from "../entities/membership";



@ObjectType()
class FieldError{

    @Field()
    field : string
    
    @Field()
    message: string
}

@ObjectType()
class GroupSearchResponse {

    @Field(() => [Group])
    groups?: Group

    @Field(() => [FieldError])
    errors?: FieldError[]
}

@ObjectType()
class GroupResponse {

    @Field(() => Group)
    group?: Group

    @Field(() => [FieldError])
    errors?: FieldError[]
}

@ObjectType()
class GroupMembershipResponse {

    @Field(() => User)
    membership?: Membership

    @Field(() => [FieldError])
    errors?: FieldError[]

}


@InputType()
class GroupCreateParameters {

    @Field(() => String)
    name!: string

    @Field(() => String)
    description! : string

}

@InputType()
class MembershipParameters {
    @Field(() => String)
    id!: string

    @Field(() => String)
    email!: string

    @Field(() => UserRole)
    role?: UserRole
}



@Resolver()
export default class GroupResolver {

    checkAdminPermission(user : User, group_id : string) : boolean {

        const memberships = user.memberships.filter((x) => x.id == group_id);

        if (memberships.length != 1) {
            return false
        }
        else if (memberships[0].role != "admin") {
            return false
        }
        return true
    }

    @Query(() => GroupResponse)
    async getGroup(
        @Ctx() { em, req }: MyContext,
        @Arg("id") group_id : string
    ) : Promise<GroupResponse> {

        if (!req.session.user) {
            return {
                errors: [
                    {
                        field: "user_id",
                        message: "User is not signed in, or doesn't have credentials!"
                    }
                ]
            }
        }

        const membership = await em.findOne(Membership, { group: group_id, member: req.session.user});

        if (!membership) {
            return {
                errors: [
                    {
                        field: "group_id",
                        message: "You are not in this group!"
                    }
                ]
            }
        }

        return {
            group : membership.group
        }
    }

    @Query(() => GroupSearchResponse)
    async searchGroups(
 
    ) :  Promise<GroupSearchResponse>{
        throw new Error("Not implemented!")
    }

    @Mutation(() => GroupResponse)
    async create(
        @Ctx() { em, req } : MyContext,
        @Arg("options") options : GroupCreateParameters
    ) : Promise<GroupResponse> {

        const newGroup = em.create(Group, options);

        try {
            await em.persistAndFlush(newGroup);
        }
        catch (err){
            console.error(err);
            return {
                errors: [{
                    field: "Nan",
                    message: "Implement this!"
                }]
            }
        }

        return {
            group: newGroup
        }
    }

    @Mutation(() => GroupResponse)
    modify(
        @Ctx() { em, req }: MyContext,
    ) : GroupResponse {
        throw new Error("Not implemented!")
    }

    @Mutation(() => GroupMembershipResponse)
    async addMember(
        @Ctx() { em, req }: MyContext,
        @Arg("options") options : MembershipParameters
    ) : Promise<GroupMembershipResponse> {
        if (!req.session.user) {
            return {
                errors: [{
                    field: "NAN",
                    message: "User is not using active session!"
                }]
            }
        }

        if (!this.checkAdminPermission(req.session.user, options.id)) {
            return {
                errors: [{
                    field: "User",
                    message: "You do not have the permission to do this!"
                }]
            }
        }

        if (!options.role) {
            return {
                errors: [{
                    field: "role",
                    message: "Please provide a role for this user!"
                }]
            }
        }

        const newUser = await em.findOne(User, { email : options.email});

        if (!newUser) {
            return {
                errors: [{
                    field: "email",
                    message: "No user found by that email!"
                }]
            }
        }

        const group = await em.findOne(Group, { id: options.id });

        if (!group) {
            return {
                errors: [{
                    field: "id",
                    message: "No group exists with this id!"
                }]
            }
        }

        const membership = em.create(Membership, { group: group, member: newUser, role: options.role})

        try {
            await em.persistAndFlush(membership);
        }
        catch (err) {
            console.error(err);
            return {
                errors: [{
                    field: "NAN",
                    message: "UPDATE THIS GOING FORWARD!!!!!"
                }]
            }
        }

        newUser?.memberships.add(membership);

        return {
            membership
        }
    }

    @Mutation(() => Boolean)
    async removeMember(
        @Ctx() { em, req } : MyContext,
        @Arg('options') options : MembershipParameters
    ) : Promise<boolean> {

        if (!req.session.user) {
            return false
        }

        if (!this.checkAdminPermission(req.session.user, options.id)) {
            return false
        }

        const group = await em.findOne(Group, { id: options.id});

        if (!group) {
            console.log("Group Resolver error in removeMember", "No group corresponds to this id!", `id: ${options.id}`);
            return false
        }

        const user = await em.findOne(User, { email: options.email});

        if (!user) {
            console.log("Group Resolver error in removeMember", "No user corresponds to this email!", `email: ${options.email}`);
            return false
        }

        const intersection = new Set([...user.memberships].filter(x => group.memberships.contains(x)));

        if (intersection.size < 1) {
            return false;
        }

        const membership : Membership = intersection.values().next().value

        try {
            await em.removeAndFlush(membership);
        }
        catch (err) {
            console.error(err);
            return false
        }

        user.memberships.remove(membership);

        group.memberships.remove(membership);

        return true;
    }

    @Mutation(() => Boolean)
    async leave(
        @Ctx() { em, req } : MyContext,
        @Arg('options') options : MembershipParameters
    ) : Promise<boolean> {
        if (!req.session.user) {
            return false
        }
        const memberships = req.session.user.memberships.filter((x) => x.group.id == options.id)
        if (memberships.length != 1) {
            return false
        }

        // ADD A CHECK HERE TO ENSURE LAST ADMIN HAS TO PROMOTE SOMEONE ELSE BEFORE LEAVING!

        const membership = memberships[0];

        try {
            await em.removeAndFlush(membership);
        }
        catch (err) {
            console.error(err)
            return false;
        }

        req.session.user.memberships.remove(membership);

        return true;
    }

}