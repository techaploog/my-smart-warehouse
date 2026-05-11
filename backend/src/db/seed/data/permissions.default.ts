const RESOURCES = [
  "item-brands",
  "item-categories",
  "item-master",
  "item-master-docs",
  "item-master-images",
  "item-suppliers",
  "item-units",
  "stock",
  "store-masters",
  "user-store",
  "users",
] as const;

const ACTIONS = ["read", "create", "update", "delete"] as const;

/** Keys + descriptions for `permissions` rows; keys are reused for admin `user_permissions`. */
export type PermissionDefaultRow = {
  key: string;
  description: string;
};

export const PERMISSIONS_DEFAULT: PermissionDefaultRow[] = RESOURCES.flatMap((resource) =>
  ACTIONS.map((action) => ({
    key: `${resource}:${action}`,
    description: `Allows ${action} access for ${resource}`,
  })),
);
