import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { __prod__ } from "./constants"
import { User } from "./entities";
import path from "path";
import "dotenv/config";


export default {
    dbName: "NoteTaker",
    user: "postgres",
    password: process.env.DB_PASSWORD,
    debug: !__prod__,
    entities: [User],
    migrations: {
        path: path.join(__dirname, "./migrations"),
        pathTs: path.join(__dirname, "./migrations"),
    },
    driver: PostgreSqlDriver,
    schema: "public",
} as Parameters<typeof MikroORM.init>[0];