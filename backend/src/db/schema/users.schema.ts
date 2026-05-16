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
  key: varchar("key", { length: 50 }).primaryKey(), // resource:action
  description: text("description"),
});

export const groups = pgTable("groups", {
  code: varchar("code", { length: 20 }).primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const groupPermissions = pgTable(
  "group_permissions",
  {
    groupCode: varchar("group_code", { length: 20 }).references(() => groups.code, {
      onDelete: "cascade",
    }),
    permissionKey: varchar("permission_key", { length: 50 }).references(() => permissions.key, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.groupCode, table.permissionKey] }),
    index("group_permissions_group_code_idx").on(table.groupCode),
  ],
);

export const userGroups = pgTable(
  "user_groups",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    groupCode: varchar("group_code", { length: 20 }).references(() => groups.code, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.groupCode] }),
    index("user_groups_user_id_idx").on(table.userId),
    index("user_groups_group_code_idx").on(table.groupCode),
  ],
);

export const userPermissions = pgTable(
  "user_permissions",
  {
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    permissionKey: varchar("permission_key", { length: 50 }).references(() => permissions.key, {
      onDelete: "cascade",
    }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.permissionKey] }),
    index("user_permissions_user_id_idx").on(table.userId),
  ],
);

export type TUser = InferSelectModel<typeof users>;
export type TUserInsert = InferInsertModel<typeof users>;

export type TUserStore = InferSelectModel<typeof userStore>;
export type TUserStoreInsert = InferInsertModel<typeof userStore>;

export type TPermission = InferSelectModel<typeof permissions>;
export type TPermissionInsert = InferInsertModel<typeof permissions>;

export type TGroup = InferSelectModel<typeof groups>;
export type TGroupInsert = InferInsertModel<typeof groups>;

export type TGroupPermission = InferSelectModel<typeof groupPermissions>;
export type TGroupPermissionInsert = InferInsertModel<typeof groupPermissions>;

export type TUserPermission = InferSelectModel<typeof userPermissions>;
export type TUserPermissionInsert = InferInsertModel<typeof userPermissions>;

export type TUserGroups = InferSelectModel<typeof userGroups>;
export type TUserGroupsInsert = InferInsertModel<typeof userGroups>;
