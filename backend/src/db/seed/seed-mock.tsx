import { connection, db } from "..";
import { itemBrands, itemCategories, itemSuppliers } from "../schema/items.schema";
import { resetTable } from "../utils";
import { MOCK_BRANDS, MOCK_CATEGORIES, MOCK_SUPPLIERS } from "./data";

if (process.env.DB_SEEDING !== "true") {
  throw new Error(`You must set DB_SEEDING to "true" when running seed`);
}

const startSeedingMock = async () => {
  try {
    await Promise.all([
      resetTable(itemBrands),
      resetTable(itemCategories),
      resetTable(itemSuppliers),
    ]);
    console.log("[INFO] Reset brand, category, and supplier tables successfully");

    await Promise.all([
      db.insert(itemBrands).values(MOCK_BRANDS),
      db.insert(itemCategories).values(MOCK_CATEGORIES),
      db.insert(itemSuppliers).values(MOCK_SUPPLIERS),
    ]);

    console.log("[INFO] Mock data for Brand, category, and supplier tables seeded successfully");
  } catch (error) {
    console.error("[ERROR] Seeding failed", error);
  } finally {
    await connection.end();
  }
};

void startSeedingMock();
