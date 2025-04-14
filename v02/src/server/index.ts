import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { AuthRouter } from './Routers/index';
import { ApolloServer } from '@apollo/server';
import "reflect-metadata";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from 'type-graphql';
import { HelloResolver, UserResolver } from './Resolvers';
import cors from "cors";

interface MyContext {
    token?: string
}

const main = async () => {

    dotenv.config();

    const app = express();

    const apolloServer = new ApolloServer<MyContext>({
        schema: await buildSchema({
            resolvers: [HelloResolver, UserResolver],
            validate: false,
        }),
    });

    await apolloServer.start();
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(express.json());

    app.use(
        '/graphql',
        cors(),
        expressMiddleware<MyContext>(apolloServer, {
            context: async ({ req, res }): Promise<MyContext> => ({
                token: req.signedCookies['access_token'] || null
            }),
        })
    );

    // Load the different routers for the server
    app.use('/', AuthRouter);

    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
}

main();

