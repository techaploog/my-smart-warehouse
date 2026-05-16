export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
  /** Branch/store codes from `user_store`; empty means global (unscoped) operator. */
  branchs: string[];
  /** Backward-compatible alias for branchs while stock/user-store services still use store terminology. */
  storeCodes: string[];
};

export type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  method: string;
  user?: AuthenticatedUser;
  /** Set by BranchGuard when the user has branch/store scope (non-empty `branchs`). */
  allowedStoreCodes?: string[];
  allowedBranchs?: string[];
};
