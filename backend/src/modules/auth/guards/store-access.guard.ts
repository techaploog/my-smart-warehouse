import { IS_PUBLIC_KEY } from "@/modules/auth/auth.constants";
import { RequestWithUser } from "@/modules/auth/auth.types";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * When the user has rows in `user_store`, sets `request.allowedStoreCodes` for downstream services.
 * Users with no store rows are global operators (no scope key set).
 */
@Injectable()
export class StoreAccessGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const storeCodes = request.user?.storeCodes ?? [];

    if (storeCodes.length === 0) {
      delete request.allowedStoreCodes;
      return true;
    }

    request.allowedStoreCodes = storeCodes;
    return true;
  }
}
