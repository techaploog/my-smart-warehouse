import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemSuppliers } from "../../db/schema";

@Injectable()
export class ItemSuppliersService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemSuppliers);
  }

  async get(code: string) {
    const rows = await this.db.select().from(itemSuppliers).where(eq(itemSuppliers.code, code));
    const row = rows[0];
    if (!row) throw new NotFoundException("Item supplier not found");
    return row;
  }

  async create(values: {
    code: string;
    name: string;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    remarks?: string | null;
  }) {
    const rows = await this.db.insert(itemSuppliers).values(values).returning();
    return rows[0];
  }

  async update(
    code: string,
    values: Partial<{
      name: string;
      address: string | null;
      phone: string | null;
      email: string | null;
      website: string | null;
      remarks: string | null;
    }>,
  ) {
    const rows = await this.db
      .update(itemSuppliers)
      .set(values)
      .where(eq(itemSuppliers.code, code))
      .returning();
    const row = rows[0];
    if (!row) throw new NotFoundException("Item supplier not found");
    return row;
  }

  async remove(code: string) {
    const rows = await this.db
      .delete(itemSuppliers)
      .where(eq(itemSuppliers.code, code))
      .returning();
    if (!rows[0]) throw new NotFoundException("Item supplier not found");
    return rows[0];
  }
}
