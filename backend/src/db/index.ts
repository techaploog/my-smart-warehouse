import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export const connection = postgres(process.env.DATABASE_URL ?? "", {
  max: 10,
});

export const db = drizzle(connection, {
  schema,
  logger: false, // TODO: turn off in production
});

export type TDatabase = typeof db;
export type TTransaction = Parameters<Parameters<TDatabase["transaction"]>[0]>[0];
export default db;
