export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  permissions: string[];
};

export type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  method: string;
  user?: AuthenticatedUser;
};
