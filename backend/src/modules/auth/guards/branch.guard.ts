import { IS_PUBLIC_KEY } from "@/modules/auth/auth.constants";
import { RequestWithUser } from "@/modules/auth/auth.types";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * Sets branch/store scope on the request for downstream services.
 * Empty `branchs` means the user is a global operator.
 */
@Injectable()
export class BranchGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const branchs = request.user?.branchs ?? request.user?.storeCodes ?? [];

    if (branchs.length === 0) {
      delete request.allowedBranchs;
      delete request.allowedStoreCodes;
      return true;
    }

    request.allowedBranchs = branchs;
    request.allowedStoreCodes = branchs;
    return true;
  }
}
