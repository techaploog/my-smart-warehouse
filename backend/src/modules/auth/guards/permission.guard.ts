import {
  IS_PUBLIC_KEY,
  PERMISSION_RESOURCE_KEY,
  PERMISSIONS_KEY,
} from "@/modules/auth/auth.constants";
import { RequestWithUser } from "@/modules/auth/auth.types";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const requiredPermissions = this.getRequiredPermissions(context, request.method);

    if (requiredPermissions.length === 0) return true;

    const userPermissions = new Set(request.user?.permissions ?? []);
    const hasPermission = requiredPermissions.every(
      (permission) => userPermissions.has(permission) || userPermissions.has("*"),
    );

    if (!hasPermission) {
      throw new ForbiddenException("Insufficient permissions");
    }

    return true;
  }

  private getRequiredPermissions(context: ExecutionContext, method: string) {
    const explicitPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (explicitPermissions?.length) return explicitPermissions;

    const resource = this.reflector.getAllAndOverride<string>(PERMISSION_RESOURCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const action = this.getActionFromMethod(method);

    return resource && action ? [`${resource}:${action}`] : [];
  }

  private getActionFromMethod(method: string) {
    switch (method.toUpperCase()) {
      case "GET":
        return "read";
      case "POST":
        return "create";
      case "PATCH":
      case "PUT":
        return "update";
      case "DELETE":
        return "delete";
      default:
        return null;
    }
  }
}
