import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { StoreAccessGuard } from "./guards/store-access.guard";
import { AuthService } from "./services/auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, StoreAccessGuard],
  exports: [AuthService, StoreAccessGuard],
})
export class AuthModule {}
