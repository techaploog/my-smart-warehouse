import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemStocks } from "../../db/schema";

@Injectable()
export class ItemStocksService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemStocks);
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
