import { connection, db } from "..";
import {
  groupPermissions,
  groups,
  itemUnits,
  permissions,
  userGroups,
  userPermissions,
  users,
} from "../schema";
import { resetTable } from "../utils";
import {
  PERMISSIONS_ALL,
  SYSTEM_ADMIN_GROUP,
  SYSTEM_ADMIN_GROUP_PERMISSIONS,
} from "./data/permissions.seed-data";
import { UNITS_DEFAULT } from "./data/units.seed-data";
import { getAdminUserData } from "./data/user.seed-data";

if (process.env.DB_SEEDING !== "true") {
  throw new Error(`You must set DB_SEEDING to "true" when running seed`);
}

const startSeeding = async () => {
  try {
    const adminUserData = await getAdminUserData();

    await resetTable(itemUnits);
    console.log("[INFO] Unit table reset successfully");

    await db.insert(itemUnits).values(UNITS_DEFAULT);
    console.log("[INFO] Unit table seeded successfully");

    await resetTable(permissions);
    console.log("[INFO] Permissions table reset successfully");

    await db
      .insert(permissions)
      .values(PERMISSIONS_ALL)
      .onConflictDoNothing({ target: permissions.key });
    console.log("[INFO] Permissions seeded successfully");

    await resetTable(groups);
    console.log("[INFO] Groups table reset successfully");

    await db.insert(groups).values(SYSTEM_ADMIN_GROUP);
    console.log("[INFO] Groups seeded successfully");

    await resetTable(groupPermissions);
    console.log("[INFO] Group permissions table reset successfully");

    await db.insert(groupPermissions).values(SYSTEM_ADMIN_GROUP_PERMISSIONS);
    console.log("[INFO] Group permissions seeded successfully");

    await resetTable(users);
    console.log("[INFO] Users table reset successfully");

    const [adminUser] = await db.insert(users).values(adminUserData).returning();
    console.log("[INFO] Users seeded successfully");

    await resetTable(userGroups);
    console.log("[INFO] User groups table reset successfully");

    await db.insert(userGroups).values({
      userId: adminUser.id,
      groupCode: SYSTEM_ADMIN_GROUP.code,
    });
    console.log("[INFO] User groups seeded successfully");

    // userPermissions is additional after groupPermissions\
    // Just wipe table and don't seed
    await resetTable(userPermissions);
    console.log("[INFO] User permissions table reset successfully");
  } catch (error) {
    console.error("[ERROR] Seeding failed", error);
  } finally {
    await connection.end();
  }
};

void startSeeding();
