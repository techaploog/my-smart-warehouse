import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { BranchGuard } from "./guards/branch.guard";
import { PermissionGuard } from "./guards/permission.guard";
import { PermissionsGuard } from "./guards/permissions.guard";
import { StoreAccessGuard } from "./guards/store-access.guard";
import { AuthService } from "./services/auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, BranchGuard, StoreAccessGuard, PermissionGuard, PermissionsGuard],
  exports: [AuthService, BranchGuard, StoreAccessGuard, PermissionGuard, PermissionsGuard],
})
export class AuthModule {}
