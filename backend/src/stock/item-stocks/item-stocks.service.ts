import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import type { TDatabase } from "@/db";
import { itemStocks } from "@/db/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, count, eq, type SQL } from "drizzle-orm";
import { DB } from "../../database/database.constants";

@Injectable()
export class ItemStocksService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list(query: PaginationQuery & { code?: string; storeCode?: string; itemSku?: string }) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;
    const filters: SQL[] = [];

    if (query.code) filters.push(eq(itemStocks.code, query.code));
    if (query.storeCode) filters.push(eq(itemStocks.storeCode, query.storeCode));
    if (query.itemSku) filters.push(eq(itemStocks.itemSku, query.itemSku));

    const where = filters.length ? and(...filters) : undefined;

    const [{ count: totalRaw }] = await this.db
      .select({ count: count() })
      .from(itemStocks)
      .where(where);
    const total = Number(totalRaw ?? 0);

    const items = await this.db
      .select()
      .from(itemStocks)
      .where(where)
      .orderBy(asc(itemStocks.code))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async get(code: string) {
    const rows = await this.db.select().from(itemStocks).where(eq(itemStocks.code, code));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item stock not found");
    return row;
  }

  async create(values: {
    code: string;
    name: string;
    description?: string | null;
    itemSku?: string | null;
    storeCode?: string | null;
    qty?: number;
    maxQty?: number;
    minQty?: number;
    reorderPoint?: number;
    safetyStock?: number;
    remarks?: string | null;
  }) {
    const rows = await this.db.insert(itemStocks).values(values).returning();
    return rows[0];
  }

  async update(
    code: string,
    values: Partial<{
      name: string;
      description: string | null;
      itemSku: string | null;
      storeCode: string | null;
      qty: number;
      maxQty: number;
      minQty: number;
      reorderPoint: number;
      safetyStock: number;
      remarks: string | null;
      isActive: boolean;
    }>,
  ) {
    const rows = await this.db
      .update(itemStocks)
      .set(values)
      .where(eq(itemStocks.code, code))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item stock not found");
    return row;
  }

  async remove(code: string) {
    const rows = await this.db.delete(itemStocks).where(eq(itemStocks.code, code)).returning();
    if (!rows[0]) throw new NotFoundException("Item stock not found");
    return rows[0];
  }
}
