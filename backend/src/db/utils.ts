import db from "./index";
import { Table, getTableName, sql } from "drizzle-orm";

export async function resetTable(table: Table) {
  return db.execute(sql.raw(`TRUNCATE TABLE "${getTableName(table)}" RESTART IDENTITY CASCADE`));
}
