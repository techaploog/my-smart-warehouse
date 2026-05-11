import { AuthModule } from "@/modules/auth/module";
import { Module } from "@nestjs/common";
import { UserStoresController } from "./controllers/user-stores.controller";
import { UserStoresService } from "./services/user-stores.service";

@Module({
  imports: [AuthModule],
  controllers: [UserStoresController],
  providers: [UserStoresService],
})
export class UserStoresModule {}
