import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";

let db: any = null;

export async function getDB() {
  if (!db) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    db = drizzle(connection);
  }
  return db;
}