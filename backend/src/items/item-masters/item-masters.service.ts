import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { itemMaster } from "@/db/schema";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { asc, count, eq } from "drizzle-orm";

@Injectable()
export class ItemMastersService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list(query: PaginationQuery) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;

    const [{ count: totalRaw }] = await this.db.select({ count: count() }).from(itemMaster);
    const total = Number(totalRaw ?? 0);

    const items = await this.db
      .select()
      .from(itemMaster)
      .orderBy(asc(itemMaster.sku))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async get(sku: string) {
    const rows = await this.db.select().from(itemMaster).where(eq(itemMaster.sku, sku));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item master not found");
    return row;
  }

  async create(values: {
    sku: string;
    name: string;
    description?: string | null;
    categoryId?: string | null;
    brandId?: string | null;
    model?: string | null;
    specification?: string | null;
    unit?: string | null;
    unitPrice?: string;
    supplierId?: string | null;
    buildOutAt?: Date | null;
    effectiveFrom?: Date | null;
    effectiveTo?: Date | null;
    orderLeadTime?: number;
    remarks?: string | null;
  }) {
    const rows = await this.db.insert(itemMaster).values(values).returning();
    return rows[0];
  }

  async update(
    sku: string,
    values: Partial<{
      name: string;
      description: string | null;
      categoryId: string | null;
      brandId: string | null;
      model: string | null;
      specification: string | null;
      unit: string | null;
      unitPrice: string;
      supplierId: string | null;
      buildOutAt: Date | null;
      effectiveFrom: Date | null;
      effectiveTo: Date | null;
      orderLeadTime: number;
      remarks: string | null;
      isActive: boolean;
    }>,
  ) {
    const rows = await this.db
      .update(itemMaster)
      .set(values)
      .where(eq(itemMaster.sku, sku))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item master not found");
    return row;
  }

  async remove(sku: string) {
    const rows = await this.db.delete(itemMaster).where(eq(itemMaster.sku, sku)).returning();
    if (!rows[0]) throw new NotFoundException("Item master not found");
    return rows[0];
  }
}
