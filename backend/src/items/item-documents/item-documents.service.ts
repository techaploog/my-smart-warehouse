import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { DB } from "../../database/database.constants";
import type { TDatabase } from "../../db";
import { itemsDocuments } from "../../db/schema";

@Injectable()
export class ItemDocumentsService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async list() {
    return this.db.select().from(itemsDocuments);
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
