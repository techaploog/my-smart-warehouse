import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { storeMasters, userStore, users } from "@/db/schema";
import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, asc, eq } from "drizzle-orm";

@Injectable()
export class UserStoresService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  private assertCallerCanManageStore(callerStoreCodes: string[], storeCode: string) {
    if (!callerStoreCodes.length) return;
    if (!callerStoreCodes.includes(storeCode)) {
      throw new ForbiddenException("You can only manage users for your own stores");
    }
  }

  async assignUserToStore(
    callerStoreCodes: string[],
    targetUserId: string,
    storeCode: string,
  ) {
    this.assertCallerCanManageStore(callerStoreCodes, storeCode);

    const [target] = await this.db.select({ id: users.id }).from(users).where(eq(users.id, targetUserId));
    if (!target) throw new NotFoundException("User not found");

    const [store] = await this.db
      .select({ code: storeMasters.code })
      .from(storeMasters)
      .where(eq(storeMasters.code, storeCode));
    if (!store) throw new NotFoundException("Store not found");

    const existing = await this.db
      .select()
      .from(userStore)
      .where(and(eq(userStore.userId, targetUserId), eq(userStore.storeCode, storeCode)));
    if (existing[0]) {
      throw new ConflictException("User is already assigned to this store");
    }

    const [row] = await this.db
      .insert(userStore)
      .values({ userId: targetUserId, storeCode })
      .returning();
    return row;
  }

  async removeUserFromStore(
    callerStoreCodes: string[],
    targetUserId: string,
    storeCode: string,
  ) {
    this.assertCallerCanManageStore(callerStoreCodes, storeCode);

    const rows = await this.db
      .delete(userStore)
      .where(and(eq(userStore.userId, targetUserId), eq(userStore.storeCode, storeCode)))
      .returning();
    if (!rows[0]) throw new NotFoundException("User store assignment not found");
    return rows[0];
  }

  async listStoresForUser(
    callerId: string,
    callerStoreCodes: string[],
    targetUserId: string,
  ) {
    const rows = await this.db
      .select({ storeCode: userStore.storeCode })
      .from(userStore)
      .where(eq(userStore.userId, targetUserId))
      .orderBy(asc(userStore.storeCode));

    if (targetUserId === callerId) {
      return rows;
    }

    if (!callerStoreCodes.length) {
      return rows;
    }

    const allowed = new Set(callerStoreCodes);
    return rows.filter((r) => r.storeCode && allowed.has(r.storeCode));
  }
}
