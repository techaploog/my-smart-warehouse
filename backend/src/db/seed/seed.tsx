import { hashPassword } from "@/modules/auth/auth.crypto";
import { eq } from "drizzle-orm";
import { connection, db } from "..";
import { itemUnits, permissions, TUserPermissionInsert, userPermissions, users } from "../schema";
import { resetTable } from "../utils";
import { PERMISSIONS_DEFAULT } from "./data/permissions.default";
import { UNITS_DEFAULT } from "./data/units.default";

if (process.env.DB_SEEDING !== "true") {
  throw new Error(`You must set DB_SEEDING to "true" when running seed`);
}

const startSeeding = async () => {
  try {
    await resetTable(itemUnits);
    console.log("[INFO] Unit table reset successfully");

    await Promise.all(
      UNITS_DEFAULT.map((unit) => {
        return db.insert(itemUnits).values(unit);
      }),
    );
    console.log("[INFO] Unit table seeded successfully");

    await db
      .insert(permissions)
      .values(PERMISSIONS_DEFAULT)
      .onConflictDoNothing({ target: permissions.key });
    console.log("[INFO] Permissions seeded successfully");

    const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";
    const adminName = process.env.ADMIN_NAME ?? "Administrator";

    const [adminUser] = await db
      .insert(users)
      .values({
        email: adminEmail,
        name: adminName,
        password: await hashPassword(adminPassword),
      })
      .onConflictDoUpdate({
        target: users.email,
        set: {
          name: adminName,
          password: await hashPassword(adminPassword),
          isActive: true,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (adminUser) {
      await db.delete(userPermissions).where(eq(userPermissions.userId, adminUser.id));
      const userPermissionRows: TUserPermissionInsert[] = PERMISSIONS_DEFAULT.map((permission) => ({
        userId: adminUser.id,
        permissionKey: permission.key,
        value: permission.key,
      }));
      await db.insert(userPermissions).values(userPermissionRows);
      console.log(`[INFO] Admin user seeded successfully: ${adminEmail}`);
    }
  } catch (error) {
    console.error("[ERROR] Seeding failed", error);
  } finally {
    await connection.end();
  }
};

void startSeeding();
