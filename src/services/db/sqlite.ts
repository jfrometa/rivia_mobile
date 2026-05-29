import * as SQLite from "expo-sqlite";

const DB_NAME = "rivia.db";

export async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  return await SQLite.openDatabaseAsync(DB_NAME);
}

// TODO: Initialize tables when needed
export async function initializeDatabase(): Promise<void> {
  // const db = await openDatabase();
  // Example table creation (uncomment and adapt when needed):
  // await db.execAsync(`
  //   CREATE TABLE IF NOT EXISTS items (
  //     id TEXT PRIMARY KEY NOT NULL,
  //     data TEXT NOT NULL
  //   );
  // `);
}
