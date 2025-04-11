import Database from 'better-sqlite3';
const db = new Database(`./server/Storage/notetaker_dev.db`);
export default db;
