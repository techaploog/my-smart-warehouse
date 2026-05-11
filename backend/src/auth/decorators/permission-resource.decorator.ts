import { SetMetadata } from "@nestjs/common";
import { PERMISSION_RESOURCE_KEY } from "../auth.constants";

export const PermissionResource = (resource: string) =>
  SetMetadata(PERMISSION_RESOURCE_KEY, resource);
