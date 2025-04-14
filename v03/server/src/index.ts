import { MikroORM } from "@mikro-orm/postgresql";
import microOrmConfig from "./mikro-orm.config";
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { HelloResolver, UserResolver } from "./resolvers";
import express from "express"
import cors from "cors";
import { User } from "./entities";
import http from "http";
import { MyContext } from "./types";
import connectRedis from "connect-redis"
import session from "express-session";
import {createClient} from "redis";

const main = async () => {
    const app = express();

    const httpServer = http.createServer(app);

    const redisClient = createClient();

    await redisClient.connect().catch(console.error);

    const RedisStore = connectRedis(session);

    app.use(
        session({
            name: "qid",
            store: new RedisStore({ client: redisClient }),
            secret: "this is not going to work",
            resave: false
        })
    )

    const orm = await MikroORM.init(microOrmConfig);

    /* await orm.getMigrator().up(); */

    const contextManager = orm.em.fork({
        useContext: true
    });

    const users = await contextManager.find(User, {});

    console.log(users);

    
    const apolloServer = new ApolloServer<MyContext>(
        {
            schema: await buildSchema(
                {
                    resolvers: [HelloResolver, UserResolver],
                    validate: false,
                }
            ),
            plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        }
    )

    await apolloServer.start();


    app.use(
        "/graphql",
        cors(),
        express.json(),
        expressMiddleware<MyContext>(apolloServer,
            {
                context: async () => ({
                    em: contextManager
                } as MyContext)
            }
        )
    )


    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

main().catch(console.error);