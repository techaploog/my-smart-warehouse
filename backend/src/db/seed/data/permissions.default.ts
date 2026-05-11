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
] as const;

const ACTIONS = ["read", "create", "update", "delete"] as const;

export const PERMISSIONS_DEFAULT = RESOURCES.flatMap((resource) =>
  ACTIONS.map((action) => ({
    key: `${resource}:${action}`,
    description: `Allows ${action} access for ${resource}`,
  })),
);
