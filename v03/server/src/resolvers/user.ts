import { Ctx, Query, Resolver, Arg, Mutation, InputType, Field, ObjectType } from "type-graphql";
import { User } from "../entities";
import { MyContext } from "src/types";
import argon2 from "argon2";

@InputType()
class AuthInput {
    @Field()
    email!: string
    @Field()
    password!: string
}

@ObjectType()
class FieldError{
    @Field()
    field : string
    @Field()
    message: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]
    @Field(() => User, { nullable: true })
    user? : User
}



@Resolver()
export default class UserResolver {
    @Query(() => UserResponse, { nullable: true })
    async login(
        @Ctx() { em }: MyContext,
        @Arg('options') options : AuthInput,
    ) : Promise<UserResponse> {

        const user = await em.findOne(User, { email: options.email });

        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "No account linked with this email"
                    }
                ]
            };
        }

        const valid : boolean = await argon2.verify(options.password, user.password);
        if (valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            };
        }

        return {user};
    }

    @Mutation(() => UserResponse, { nullable: true})
    async register(
        @Ctx() { em }: MyContext,
        @Arg('options') options : AuthInput,
    ) : Promise<UserResponse> {

        const hashedPassword = await argon2.hash(options.password);

        const user = em.create(User, {
            email: options.email,
            password: hashedPassword
        });
        try {
            await em.persistAndFlush(user)
        }
        catch(err)  {
            console.error(err);
            if (err.code === '23505') {
                return {
                    errors: [{
                        field: "email",
                        message: "There is already an account linked with this name!"
                    }]
                }
            }
        }

        return {user};
    }
}