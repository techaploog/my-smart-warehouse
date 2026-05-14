import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  boolean,
  index,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { storeMasters } from "./stock.schema";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  isActive: boolean("is_active").notNull().default(false),
});

export const userStore = pgTable(
  "user_store",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    storeCode: varchar("store_code", { length: 20 }).references(() => storeMasters.code, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.storeCode] }),
    index("user_store_user_id_idx").on(table.userId),
    index("user_store_store_code_idx").on(table.storeCode),
  ],
);

export const permissions = pgTable("permissions", {
  key: varchar("key", { length: 50 }).primaryKey(),
  description: text("description"),
});

export const permissionGroups = pgTable("permission_groups", {
  code: varchar("code", { length: 20 }).primaryKey(),
  permissionsKey: varchar("permissions_key", { length: 50 }).references(() => permissions.key, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description"),
});

export const userPermissions = pgTable(
  "user_permissions",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    permissionKey: varchar("permission_key", { length: 50 }).references(() => permissions.key, {
      onDelete: "cascade",
    }),
    value: text("value").notNull(), // resource:action
  },
  (table) => [index("user_permissions_user_id_idx").on(table.userId)],
);

export type TUser = InferSelectModel<typeof users>;
export type TUserInsert = InferInsertModel<typeof users>;
export type TUserStore = InferSelectModel<typeof userStore>;
export type TUserStoreInsert = InferInsertModel<typeof userStore>;
export type TPermission = InferSelectModel<typeof permissions>;
export type TPermissionInsert = InferInsertModel<typeof permissions>;
export type TPermissionGroup = InferSelectModel<typeof permissionGroups>;
export type TPermissionGroupInsert = InferInsertModel<typeof permissionGroups>;
export type TUserPermission = InferSelectModel<typeof userPermissions>;
export type TUserPermissionInsert = InferInsertModel<typeof userPermissions>;
