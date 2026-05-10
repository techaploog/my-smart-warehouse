import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemBrands } from "../../db/schema";

@Injectable()
export class ItemBrandsService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemBrands);
  }

  async get(code: string) {
    const rows = await this.db.select().from(itemBrands).where(eq(itemBrands.code, code));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item brand not found");
    return row;
  }

  async create(values: { code: string; name: string }) {
    const rows = await this.db.insert(itemBrands).values(values).returning();
    return rows[0];
  }

  async update(code: string, values: Partial<{ name: string }>) {
    const rows = await this.db
      .update(itemBrands)
      .set(values)
      .where(eq(itemBrands.code, code))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item brand not found");
    return row;
  }

  async remove(code: string) {
    const rows = await this.db.delete(itemBrands).where(eq(itemBrands.code, code)).returning();
    if (!rows[0]) throw new NotFoundException("Item brand not found");
    return rows[0];
  }
}
