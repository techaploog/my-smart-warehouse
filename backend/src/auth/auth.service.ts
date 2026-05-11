import { DB } from "@/database/database.constants";
import type { TDatabase } from "@/db";
import { userPermissions, users } from "@/db/schema";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { AuthenticatedUser } from "./auth.types";
import { verifyPassword } from "./auth.crypto";
import { signJwt, verifyJwt } from "./jwt.util";

@Injectable()
export class AuthService {
  constructor(@Inject(DB) private readonly db: TDatabase) {}

  async login(email: string, password: string) {
    const user = await this.findActiveUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const permissions = await this.getUserPermissions(user.id);
    const accessToken = signJwt(
      { sub: user.id, email: user.email },
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
      },
    };
  }

  async validateBearerToken(token: string): Promise<AuthenticatedUser> {
    try {
      const payload = verifyJwt(token, this.getJwtSecret());
      const user = await this.findActiveUserById(payload.sub);

      if (!user) throw new UnauthorizedException("Invalid token subject");

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        permissions: await this.getUserPermissions(user.id),
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
    const rows = await this.db
      .select({ permissionKey: userPermissions.permissionKey, value: userPermissions.value })
      .from(userPermissions)
      .where(eq(userPermissions.userId, userId));

    return Array.from(
      new Set(
        rows
          .map((row) => row.value || row.permissionKey)
          .filter((value): value is string => !!value),
      ),
    );
  }

  private getJwtSecret() {
    return process.env.JWT_SECRET ?? "dev-only-change-me";
  }

  private getJwtTtlSeconds() {
    return Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24);
  }
}
