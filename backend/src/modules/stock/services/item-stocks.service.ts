import { buildPaginatedResult, type PaginationQuery } from "@/common/pagination/pagination.schema";
import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { itemStocks } from "@/db/schema";
import { ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { and, asc, count, eq, inArray, isNull, type SQL } from "drizzle-orm";

export type StoreScope = string[] | null;

@Injectable()
export class ItemStocksService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  private assertStoreAllowed(scope: StoreScope, storeCode: string | null | undefined) {
    if (!scope?.length) return;
    if (!storeCode || !scope.includes(storeCode)) {
      throw new ForbiddenException("Store not allowed for this user");
    }
  }

  private stockKeyWhere(code: string, storeCode: string, itemSku: string | null): SQL {
    const skuPart =
      itemSku === null || itemSku === ""
        ? isNull(itemStocks.itemSku)
        : eq(itemStocks.itemSku, itemSku);
    return and(eq(itemStocks.code, code), eq(itemStocks.storeCode, storeCode), skuPart)!;
  }

  async list(
    query: PaginationQuery & { code?: string; storeCode?: string; itemSku?: string },
    scope: StoreScope,
  ) {
    const { page, pageSize } = query;
    const offset = (page - 1) * pageSize;
    const filters: SQL[] = [];

    if (scope?.length) {
      filters.push(inArray(itemStocks.storeCode, scope));
    }

    if (query.code) filters.push(eq(itemStocks.code, query.code));
    if (query.storeCode) {
      this.assertStoreAllowed(scope, query.storeCode);
      filters.push(eq(itemStocks.storeCode, query.storeCode));
    }
    if (query.itemSku !== undefined) {
      if (query.itemSku === "" || query.itemSku === null) {
        filters.push(isNull(itemStocks.itemSku));
      } else {
        filters.push(eq(itemStocks.itemSku, query.itemSku));
      }
    }

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
      .orderBy(asc(itemStocks.storeCode), asc(itemStocks.code), asc(itemStocks.itemSku))
      .limit(pageSize)
      .offset(offset);

    return buildPaginatedResult(items, total, page, pageSize);
  }

  async get(code: string, storeCode: string, itemSku: string | null, scope: StoreScope) {
    this.assertStoreAllowed(scope, storeCode);
    const rows = await this.db
      .select()
      .from(itemStocks)
      .where(this.stockKeyWhere(code, storeCode, itemSku));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item stock not found");
    return row;
  }

  async create(
    values: {
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
    },
    scope: StoreScope,
  ) {
    this.assertStoreAllowed(scope, values.storeCode ?? null);
    const rows = await this.db.insert(itemStocks).values(values).returning();
    return rows[0];
  }

  async update(
    code: string,
    storeCode: string,
    itemSku: string | null,
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
    scope: StoreScope,
  ) {
    this.assertStoreAllowed(scope, storeCode);
    if (values.storeCode !== undefined) {
      this.assertStoreAllowed(scope, values.storeCode);
    }

    const rows = await this.db
      .update(itemStocks)
      .set(values)
      .where(this.stockKeyWhere(code, storeCode, itemSku))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item stock not found");
    return row;
  }

  async remove(code: string, storeCode: string, itemSku: string | null, scope: StoreScope) {
    this.assertStoreAllowed(scope, storeCode);
    const rows = await this.db
      .delete(itemStocks)
      .where(this.stockKeyWhere(code, storeCode, itemSku))
      .returning();
    if (!rows[0]) throw new NotFoundException("Item stock not found");
    return rows[0];
  }
}
