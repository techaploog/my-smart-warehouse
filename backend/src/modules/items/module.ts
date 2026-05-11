import { Module } from "@nestjs/common";
import { ItemBrandsController } from "./controllers/item-brands.controller";
import { ItemCategoriesController } from "./controllers/item-categories.controller";
import { ItemDocumentsController } from "./controllers/item-documents.controller";
import { ItemImagesController } from "./controllers/item-images.controller";
import { ItemMastersController } from "./controllers/item-masters.controller";
import { ItemSuppliersController } from "./controllers/item-suppliers.controller";
import { ItemUnitsController } from "./controllers/item-units.controller";
import { ItemBrandsService } from "./services/item-brands.service";
import { ItemCategoriesService } from "./services/item-categories.service";
import { ItemDocumentsService } from "./services/item-documents.service";
import { ItemImagesService } from "./services/item-images.service";
import { ItemMastersService } from "./services/item-masters.service";
import { ItemSuppliersService } from "./services/item-suppliers.service";
import { ItemUnitsService } from "./services/item-units.service";

@Module({
  controllers: [
    ItemBrandsController,
    ItemCategoriesController,
    ItemSuppliersController,
    ItemUnitsController,
    ItemMastersController,
    ItemImagesController,
    ItemDocumentsController,
  ],
  providers: [
    ItemBrandsService,
    ItemCategoriesService,
    ItemSuppliersService,
    ItemUnitsService,
    ItemMastersService,
    ItemImagesService,
    ItemDocumentsService,
  ],
})
export class ItemsModule {}
