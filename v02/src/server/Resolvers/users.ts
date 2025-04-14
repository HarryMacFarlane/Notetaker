import { Resolver, ObjectType, Mutation, Field, Query } from "type-graphql";


class authInput {
    @Field()
    email: string
    @Field()
    password: string
}

@ObjectType()
class UserResponse {
    @Field()
    error?: [
        Error
    ]
    @Field()
    user?: string
}

@Resolver()
export default class User {
    @Mutation(() => UserResponse)
    async register(data : authInput) {
        console.log(data);
        return {
            user: "It works?"
        }
    }
    @Query(() => UserResponse)
    async login(data : authInput) {
        console.log(data);
        return {
            user: "It works?"
        }
    }
}