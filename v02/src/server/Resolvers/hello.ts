import { Query, Resolver } from "type-graphql";

@Resolver()
export default class Hello {
    @Query(() => String)
    hello() {
        return "hello world";
    }
}