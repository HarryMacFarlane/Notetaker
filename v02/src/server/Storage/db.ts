import Database from 'better-sqlite3';
import type { Database as BetterSqliteDatabase } from 'better-sqlite3';
const db: BetterSqliteDatabase = new Database(`./storage/notetaker_dev.db`);
export default db;