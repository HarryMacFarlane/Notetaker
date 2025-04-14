"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./Routers/index");
const server_1 = require("@apollo/server");
require("reflect-metadata");
const express4_1 = require("@apollo/server/express4");
const type_graphql_1 = require("type-graphql");
const Resolvers_1 = require("./Resolvers");
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    const apolloServer = new server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [Resolvers_1.HelloResolver, Resolvers_1.UserResolver],
            validate: false,
        }),
    });
    await apolloServer.start();
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
    app.use(express_1.default.json());
    app.use('/graphql', (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: async ({ req, res }) => ({
            req,
            res,
            token: req.signedCookies['access_token'] || null
        }),
    }));
    app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
    app.use(express_1.default.json());
    app.use('/', index_1.AuthRouter);
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
};
main();
//# sourceMappingURL=index.js.map