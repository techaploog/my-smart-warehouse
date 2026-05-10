import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { itemImages } from "@/db/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, count, eq } from "drizzle-orm";

@Injectable()
export class ItemImagesService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list(query: PaginationQuery) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const [{ count: totalRaw }] = await this.db.select({ count: count() }).from(itemImages);
    const total = Number(totalRaw ?? 0);

    const items = await this.db
      .select()
      .from(itemImages)
      .orderBy(asc(itemImages.key))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async listByItem(sku: string) {
    return this.db
      .select()
      .from(itemImages)
      .where(eq(itemImages.itemMasterId, sku))
      .orderBy(asc(itemImages.seq), asc(itemImages.key));
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

  async updateForItem(
    sku: string,
    key: string,
    values: Partial<{ seq: number; itemMasterId: string | null; isActive: boolean }>,
  ) {
    const rows = await this.db
      .update(itemImages)
      .set({ ...values, itemMasterId: sku })
      .where(and(eq(itemImages.key, key), eq(itemImages.itemMasterId, sku)))
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

  async removeForItem(sku: string, key: string) {
    const rows = await this.db
      .delete(itemImages)
      .where(and(eq(itemImages.key, key), eq(itemImages.itemMasterId, sku)))
      .returning();
    if (!rows[0]) throw new NotFoundException("Item image not found");
    return rows[0];
  }
}
