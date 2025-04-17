import { MikroORM } from "@mikro-orm/postgresql";
import microOrmConfig from "./mikro-orm.config";
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { buildSchema } from "type-graphql";
import { HelloResolver, UserResolver, GroupResolver } from "./resolvers";
import express, { Request, Response } from "express"
import cors from "cors";
import http from "http";
import { MyContext } from "./types";
import { RedisStore } from "connect-redis"
import session from "express-session";
import {createClient} from "redis";
import { __prod__ } from "./constants";

const main = async () => {
    const app = express();

    const httpServer = http.createServer(app);

    const redisClient = createClient();

    await redisClient.connect().catch(console.error);

    redisClient.on('error', error => {
        console.error(`Redis client error:`, error);
    });

    app.use(
        session({
            name: "qid",
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                sameSite: "lax",
                httpOnly: true,
                secure: __prod__,
            },
            secret: "this is not going to work",
            resave: false,
            saveUninitialized: false
        })
    );

    const orm = await MikroORM.init(microOrmConfig);

    /* await orm.getMigrator().up(); */

    const contextManager = orm.em.fork({
        useContext: true
    });

    
    const apolloServer = new ApolloServer<MyContext>(
        {
            schema: await buildSchema(
                {
                    resolvers: [HelloResolver, UserResolver, GroupResolver],
                    validate: false,
                }
            ),
            plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
        }
    );

    await apolloServer.start();


    app.use(
        "/graphql",
        cors<cors.CorsRequest>({
            origin: "http://localhost:5173", // ADD THIS TO ENV LATER!!!! (SET USING DOCKER?),
            credentials: true
        }),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req, res }: { req : Request, res : Response}): Promise<MyContext> => ({ em: contextManager, req, res })}
        )
    );


    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

main().catch(console.error);