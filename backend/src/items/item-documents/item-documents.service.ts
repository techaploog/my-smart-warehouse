import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { itemsDocuments } from "@/db/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, count, eq } from "drizzle-orm";

@Injectable()
export class ItemDocumentsService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list(query: PaginationQuery) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const [{ count: totalRaw }] = await this.db.select({ count: count() }).from(itemsDocuments);
    const total = Number(totalRaw ?? 0);

    const items = await this.db
      .select()
      .from(itemsDocuments)
      .orderBy(asc(itemsDocuments.key))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async get(key: string) {
    const rows = await this.db.select().from(itemsDocuments).where(eq(itemsDocuments.key, key));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item document not found");
    return row;
  }

  async create(values: {
    key: string;
    seq?: number;
    title: string;
    description?: string | null;
    type?: string;
    itemMasterId?: string | null;
  }) {
    const rows = await this.db.insert(itemsDocuments).values(values).returning();
    return rows[0];
  }

  async update(
    key: string,
    values: Partial<{
      seq: number;
      title: string;
      description: string | null;
      type: string;
      itemMasterId: string | null;
      isActive: boolean;
    }>,
  ) {
    const rows = await this.db
      .update(itemsDocuments)
      .set(values)
      .where(eq(itemsDocuments.key, key))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item document not found");
    return row;
  }

  async remove(key: string) {
    const rows = await this.db
      .delete(itemsDocuments)
      .where(eq(itemsDocuments.key, key))
      .returning();
    if (!rows[0]) throw new NotFoundException("Item document not found");
    return rows[0];
  }
}
