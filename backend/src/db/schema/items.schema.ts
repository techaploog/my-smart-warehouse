import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const itemBrands = pgTable("item_brands", {
  code: varchar("code", { length: 20 }).primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemCategories = pgTable("item_categories", {
  code: varchar("code", { length: 20 }).primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemSuppliers = pgTable("item_suppliers", {
  code: varchar("code", { length: 20 }).primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemUnits = pgTable("item_units", {
  code: varchar("code", { length: 20 }).primaryKey(),
  details: text("details"),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemMaster = pgTable(
  "item_masters",
  {
    sku: varchar("sku", { length: 100 }).primaryKey(),
    barcode: text("barcode"),
    name: text("name").notNull(),
    description: text("description"),
    tags: text("tags"),

    categoryId: text("category_id").references(() => itemCategories.code, { onDelete: "set null" }),

    brandId: text("brand_id").references(() => itemBrands.code, { onDelete: "set null" }),
    model: text("model"),
    specification: text("specification"),

    unit: varchar("unit", { length: 20 }).references(() => itemUnits.code, {
      onDelete: "set null",
    }),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull().default("0.00"),

    supplierId: text("supplier_id").references(() => itemSuppliers.code, { onDelete: "set null" }),

    effectiveFrom: timestamp("effective_from", { mode: "date", withTimezone: true }),
    effectiveTo: timestamp("effective_to", { mode: "date", withTimezone: true }),

    orderLeadTime: integer("order_lead_time").notNull().default(0),
    remarks: text("remarks"),

    createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => [index("item_master_barcode_idx").on(table.barcode)],
);

export const itemImages = pgTable("item_images", {
  key: varchar("key", { length: 100 }).primaryKey(),
  seq: integer("seq").notNull().default(0),
  itemMasterId: text("item_master_id").references(() => itemMaster.sku, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const itemsDocuments = pgTable("items_documents", {
  key: varchar("key", { length: 100 }).primaryKey(),
  seq: integer("seq").notNull().default(0),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type", { length: 20 }).notNull().default("pdf"),
  itemMasterId: text("item_master_id").references(() => itemMaster.sku, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export type TItemBrand = InferSelectModel<typeof itemBrands>;
export type TItemBrandInsert = InferInsertModel<typeof itemBrands>;
export type TItemCategory = InferSelectModel<typeof itemCategories>;
export type TItemCategoryInsert = InferInsertModel<typeof itemCategories>;
export type TItemSupplier = InferSelectModel<typeof itemSuppliers>;
export type TItemSupplierInsert = InferInsertModel<typeof itemSuppliers>;
export type TItemUnit = InferSelectModel<typeof itemUnits>;
export type TItemUnitInsert = InferInsertModel<typeof itemUnits>;
export type TItemMaster = InferSelectModel<typeof itemMaster>;
export type TItemMasterInsert = InferInsertModel<typeof itemMaster>;
export type TItemImage = InferSelectModel<typeof itemImages>;
export type TItemImageInsert = InferInsertModel<typeof itemImages>;
export type TItemsDocument = InferSelectModel<typeof itemsDocuments>;
export type TItemsDocumentInsert = InferInsertModel<typeof itemsDocuments>;
