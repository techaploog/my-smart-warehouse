export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  /** Store codes from `user_store`; empty means global (unscoped) operator for stock. */
  storeCodes: string[];
};

export type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  method: string;
  user?: AuthenticatedUser;
  /** Set by StoreAccessGuard when the user has store scope (non-empty `storeCodes`). */
  allowedStoreCodes?: string[];
};
