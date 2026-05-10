import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemUnits } from "../../db/schema";

@Injectable()
export class ItemUnitsService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemUnits);
  }

  async get(code: string) {
    const rows = await this.db.select().from(itemUnits).where(eq(itemUnits.code, code));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item unit not found");
    return row;
  }

  async create(values: { code: string; details?: string | null }) {
    const rows = await this.db.insert(itemUnits).values(values).returning();
    return rows[0];
  }

  async update(code: string, values: Partial<{ details: string | null }>) {
    const rows = await this.db
      .update(itemUnits)
      .set(values)
      .where(eq(itemUnits.code, code))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item unit not found");
    return row;
  }

  async remove(code: string) {
    const rows = await this.db.delete(itemUnits).where(eq(itemUnits.code, code)).returning();
    if (!rows[0]) throw new NotFoundException("Item unit not found");
    return rows[0];
  }
}
