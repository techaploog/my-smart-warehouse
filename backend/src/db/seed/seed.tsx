import { connection, db } from "..";
import { itemUnits } from "../schema/items.schema";
import { resetTable } from "../utils";
import { UNITS_DEFAULT } from "./data";

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
  } catch (error) {
    console.error("[ERROR] Seeding failed", error);
  } finally {
    await connection.end();
  }
};

startSeeding();
