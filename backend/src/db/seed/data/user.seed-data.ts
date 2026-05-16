import { TUserInsert } from "@/db/schema";
import { hashPassword } from "@/modules/auth/auth.crypto";

export const ADMIN_USER_PASSWORD = "admin123";

export async function getAdminUserData(): Promise<TUserInsert> {
  return {
    email: "SYSTEM_ADMIN",
    name: "System Admin",
    password: await hashPassword(ADMIN_USER_PASSWORD),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
