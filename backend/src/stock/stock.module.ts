import { Module } from "@nestjs/common";
import { StoreMastersController } from "./store-masters/store-masters.controller";
import { StoreMastersService } from "./store-masters/store-masters.service";
import { ItemStocksController } from "./item-stocks/item-stocks.controller";
import { ItemStocksService } from "./item-stocks/item-stocks.service";

@Module({
  controllers: [StoreMastersController, ItemStocksController],
  providers: [StoreMastersService, ItemStocksService],
})
export class StockModule {}

