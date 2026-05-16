const RESOURCES = [
  "item-brands",
  "item-categories",
  "item-master",
  "item-docs",
  "item-images",
  "item-suppliers",
  "item-units",
  "item-stock",
  "store-masters",
  "users",
  "user-permissions",
  "user-store",
  "groups", // and group-permissions
  // "permissions", // ! not allow to change permissions
] as const;

const ACTIONS_ALL = ["read", "create", "update", "delete"] as const;

/** Keys + descriptions for `permissions` rows; keys are reused for admin `user_permissions`. */
export type PermissionDefaultRow = {
  key: string;
  description: string;
};

export const PERMISSIONS_ALL: PermissionDefaultRow[] = RESOURCES.flatMap((resource) =>
  ACTIONS_ALL.map((action) => ({
    key: `${resource}:${action}`,
    description: `Allows ${action} access for ${resource}`,
  })),
);

export const SYSTEM_ADMIN_GROUP = {
  code: "SYSTEM-ADMIN",
  name: "System Admin",
  description: "System Admin group",
  isActive: true,
};

export const SYSTEM_ADMIN_GROUP_PERMISSIONS = PERMISSIONS_ALL.map((permission) => ({
  groupCode: SYSTEM_ADMIN_GROUP.code,
  permissionKey: permission.key,
}));
