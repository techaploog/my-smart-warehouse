import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { itemMaster } from "./items.schema";

export const storeMasters = pgTable("store_masters", {
  code: varchar("code", { length: 20 }).primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemStocks = pgTable(
  "item_stocks",
  {
    // shelf address code : may be same code for different store
    code: varchar("code", { length: 50 }),
    name: text("name").notNull(),
    description: text("description"),
    itemSku: text("item_sku").references(() => itemMaster.sku, { onDelete: "cascade" }),
    storeCode: text("store_code").references(() => storeMasters.code, {
      onDelete: "cascade",
    }),
    qty: integer("qty").notNull().default(0),
    maxQty: integer("max_qty").notNull().default(0),
    minQty: integer("min_qty").notNull().default(0),
    reorderPoint: integer("reorder_point").notNull().default(0),
    safetyStock: integer("safety_stock").notNull().default(0),
    remarks: text("remarks"),
    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).notNull().defaultNow(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [
    primaryKey({ columns: [table.code, table.storeCode, table.itemSku] }),
    index("item_stock_code_idx").on(table.code),
    index("item_stock_store_code_idx").on(table.storeCode),
    index("item_stock_item_sku_idx").on(table.itemSku),
  ],
);

export type TItemStock = InferSelectModel<typeof itemStocks>;
export type TItemStockInsert = InferInsertModel<typeof itemStocks>;
export type TStoreMaster = InferSelectModel<typeof storeMasters>;
export type TStoreMasterInsert = InferInsertModel<typeof storeMasters>;
