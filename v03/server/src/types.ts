import { SqlEntityManager } from "@mikro-orm/postgresql"

export type MyContext = {
    em: SqlEntityManager
}