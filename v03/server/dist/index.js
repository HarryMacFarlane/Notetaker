"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const mikro_orm_config_1 = __importDefault(require("./mikro-orm.config"));
const express4_1 = require("@apollo/server/express4");
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const type_graphql_1 = require("type-graphql");
const resolvers_1 = require("./resolvers");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const entities_1 = require("./entities");
const http_1 = __importDefault(require("http"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_session_1 = __importDefault(require("express-session"));
const redis_1 = require("redis");
const main = async () => {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const redisClient = (0, redis_1.createClient)();
    await redisClient.connect().catch(console.error);
    const RedisStore = (0, connect_redis_1.default)(express_session_1.default);
    app.use((0, express_session_1.default)({
        name: "qid",
        store: new RedisStore({ client: redisClient }),
        secret: "this is not going to work",
        resave: false
    }));
    const orm = await postgresql_1.MikroORM.init(mikro_orm_config_1.default);
    const contextManager = orm.em.fork({
        useContext: true
    });
    const users = await contextManager.find(entities_1.User, {});
    console.log(users);
    const apolloServer = new server_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            resolvers: [resolvers_1.HelloResolver, resolvers_1.UserResolver],
            validate: false,
        }),
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await apolloServer.start();
    app.use("/graphql", (0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)(apolloServer, {
        context: async () => ({
            em: contextManager
        })
    }));
    app.listen(3000, () => {
        console.log("Server running on http://localhost:3000");
    });
};
main().catch(console.error);
//# sourceMappingURL=index.js.map