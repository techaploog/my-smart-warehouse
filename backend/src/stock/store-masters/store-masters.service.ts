import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { storeMasters } from "../../db/schema";

@Injectable()
export class StoreMastersService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(storeMasters);
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
