import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(connection, {
  schema,
  logger: false, // TODO: turn off in production
});

export type TDatabase = typeof db;
export type TTransaction = Parameters<Parameters<TDatabase["transaction"]>[0]>[0];
export default db;
