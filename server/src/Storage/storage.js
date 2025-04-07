import Database from 'better-sqlite3';

// Constants (create seperate file for these in the future)
export const db = new Database(`./server/src/Storage/notetaker_dev.db`);