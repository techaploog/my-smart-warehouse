import { AuthModule } from "@/modules/auth/module";
import { Module } from "@nestjs/common";
import { ItemStocksController } from "./controllers/item-stocks.controller";
import { StoreMastersController } from "./controllers/store-masters.controller";
import { ItemStocksService } from "./services/item-stocks.service";
import { StoreMastersService } from "./services/store-masters.service";

@Module({
  imports: [AuthModule],
  controllers: [StoreMastersController, ItemStocksController],
  providers: [StoreMastersService, ItemStocksService],
})
export class StockModule {}
