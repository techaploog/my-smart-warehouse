import { Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionGuard } from "./permission.guard";

@Injectable()
export class PermissionsGuard extends PermissionGuard {
  constructor(reflector: Reflector) {
    super(reflector);
  }
}
