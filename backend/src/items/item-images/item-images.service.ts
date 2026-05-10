import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemImages } from "../../db/schema";

@Injectable()
export class ItemImagesService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemImages);
  }

  async get(key: string) {
    const rows = await this.db.select().from(itemImages).where(eq(itemImages.key, key));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item image not found");
    return row;
  }

  async create(values: { key: string; seq?: number; itemMasterId?: string | null }) {
    const rows = await this.db.insert(itemImages).values(values).returning();
    return rows[0];
  }

  async update(
    key: string,
    values: Partial<{ seq: number; itemMasterId: string | null; isActive: boolean }>,
  ) {
    const rows = await this.db
      .update(itemImages)
      .set(values)
      .where(eq(itemImages.key, key))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item image not found");
    return row;
  }

  async remove(key: string) {
    const rows = await this.db.delete(itemImages).where(eq(itemImages.key, key)).returning();
    if (!rows[0]) throw new NotFoundException("Item image not found");
    return rows[0];
  }
}
