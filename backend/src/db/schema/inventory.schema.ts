import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { products } from "./products.schema";

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  warehouseLocation: varchar("warehouse_location", { length: 100 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
