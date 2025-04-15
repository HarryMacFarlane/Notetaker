import { Ctx, Query, Resolver, Arg, Mutation, InputType, Field, ObjectType } from "type-graphql";
import { User } from "../entities";
import { MyContext } from "src/types";
import bcrypt from "bcrypt";

@InputType()
class AuthInput {
    @Field(() => String)
    email!: string
    @Field(() => String)
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
        @Ctx() { em, req }: MyContext,
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

        if (!bcrypt.compareSync(options.password, user.password)) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "Incorrect password"
                    }
                ]
            };
        }

        req.session.userID = user.id!; // BANG USED AS NO USER W/O ID CAN EXIST!

        return {user};
    }

    @Mutation(() => UserResponse, { nullable: true })
    async register(
        @Ctx() { em }: MyContext,
        @Arg('options') options : AuthInput,
    ) : Promise<UserResponse> {

        const hashedPassword = await bcrypt.hash(options.password, 10);

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