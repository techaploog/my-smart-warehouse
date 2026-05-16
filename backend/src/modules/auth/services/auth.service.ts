import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import {
  groupPermissions,
  groups,
  userGroups,
  userPermissions,
  userStore,
  users,
} from "@/db/schema";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { and, asc, eq, inArray } from "drizzle-orm";
import { verifyPassword } from "../auth.crypto";
import { AuthenticatedUser } from "../auth.types";
import { signJwt, verifyJwt } from "../jwt.util";

@Injectable()
export class AuthService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async login(email: string, password: string) {
    const user = await this.findActiveUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const [permissions, branchs] = await Promise.all([
      this.getUserPermissions(user.id),
      this.getUserBranchs(user.id),
    ]);
    const accessToken = signJwt(
      { sub: user.id, email: user.email, permissions, branchs },
      this.getJwtSecret(),
      this.getJwtTtlSeconds(),
    );

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: this.getJwtTtlSeconds(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions,
        branchs,
        storeCodes: branchs,
      },
    };
  }

  async validateBearerToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = verifyJwt(token, this.getJwtSecret());
      const user = await this.findActiveUserById(payload.sub);

      if (!user) throw new UnauthorizedException("Invalid token subject");

      const permissions = payload.permissions;
      const branchs = payload.branchs;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions,
        branchs,
        storeCodes: branchs,
      };
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  private async findActiveUserByEmail(email: string) {
    const rows = await this.db.select().from(users).where(eq(users.email, email.toLowerCase()));
    const user = rows[0];

    if (!user?.isActive) return null;

    return user;
  }

  private async findActiveUserById(id: string) {
    const rows = await this.db.select().from(users).where(eq(users.id, id));
    const user = rows[0];

    if (!user?.isActive) return null;

    return user;
  }

  private async getUserPermissions(userId: string) {
    const individualRows = await this.db
      .select({ permissionKey: userPermissions.permissionKey })
      .from(userPermissions)
      .where(eq(userPermissions.userId, userId));

    const userGroupRows = await this.db
      .select({ groupCode: userGroups.groupCode })
      .from(userGroups)
      .where(eq(userGroups.userId, userId));

    const userGroupCodes = userGroupRows
      .map((row) => row.groupCode)
      .filter((code): code is string => !!code);

    const activeGroupRows = userGroupCodes.length
      ? await this.db
          .select({ code: groups.code })
          .from(groups)
          .where(and(inArray(groups.code, userGroupCodes), eq(groups.isActive, true)))
      : [];

    const activeGroupCodes = activeGroupRows
      .filter((row) => row.code && userGroupCodes.includes(row.code))
      .map((row) => row.code);

    const groupRows = activeGroupCodes.length
      ? await this.db
          .select({ permissionKey: groupPermissions.permissionKey })
          .from(groupPermissions)
          .where(inArray(groupPermissions.groupCode, activeGroupCodes))
      : [];

    return Array.from(
      new Set(
        [...individualRows, ...groupRows]
          .map((row) => row.permissionKey)
          .filter((value): value is string => !!value),
      ),
    ).sort();
  }

  private async getUserBranchs(userId: string): Promise<string[]> {
    const rows = await this.db
      .select({ storeCode: userStore.storeCode })
      .from(userStore)
      .where(eq(userStore.userId, userId))
      .orderBy(asc(userStore.storeCode));

    return Array.from(
      new Set(rows.map((r) => r.storeCode).filter((code): code is string => !!code)),
    );
  }

  private getJwtSecret() {
    return process.env.JWT_SECRET ?? "dev-only-change-me";
  }

  private getJwtTtlSeconds() {
    return Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24);
  }
}
