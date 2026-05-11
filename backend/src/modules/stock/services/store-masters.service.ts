import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { storeMasters } from "@/db/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, count, eq } from "drizzle-orm";

@Injectable()
export class StoreMastersService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list(query: PaginationQuery) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const [{ count: totalRaw }] = await this.db.select({ count: count() }).from(storeMasters);
    const total = Number(totalRaw ?? 0);

    const items = await this.db
      .select()
      .from(storeMasters)
      .orderBy(asc(storeMasters.code))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async get(code: string) {
    const rows = await this.db.select().from(storeMasters).where(eq(storeMasters.code, code));
    const row = rows[0];
    if (!row) throw new NotFoundException("Store master not found");
    return row;
  }

  async create(values: {
    code: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    remarks?: string | null;
  }) {
    const rows = await this.db.insert(storeMasters).values(values).returning();
    return rows[0];
  }

  async update(
    code: string,
    values: Partial<{
      name: string;
      address: string | null;
      phone: string | null;
      email: string | null;
      remarks: string | null;
      isActive: boolean;
    }>,
  ) {
    const rows = await this.db
      .update(storeMasters)
      .set(values)
      .where(eq(storeMasters.code, code))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Store master not found");
    return row;
  }

  async remove(code: string) {
    const rows = await this.db.delete(storeMasters).where(eq(storeMasters.code, code)).returning();
    if (!rows[0]) throw new NotFoundException("Store master not found");
    return rows[0];
  }
}
