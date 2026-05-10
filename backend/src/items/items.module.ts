import { Module } from "@nestjs/common";
import { ItemBrandsController } from "./item-brands/item-brands.controller";
import { ItemBrandsService } from "./item-brands/item-brands.service";
import { ItemCategoriesController } from "./item-categories/item-categories.controller";
import { ItemCategoriesService } from "./item-categories/item-categories.service";
import { ItemDocumentsController } from "./item-documents/item-documents.controller";
import { ItemDocumentsService } from "./item-documents/item-documents.service";
import { ItemImagesController } from "./item-images/item-images.controller";
import { ItemImagesService } from "./item-images/item-images.service";
import { ItemMastersController } from "./item-masters/item-masters.controller";
import { ItemMastersService } from "./item-masters/item-masters.service";
import { ItemSuppliersController } from "./item-suppliers/item-suppliers.controller";
import { ItemSuppliersService } from "./item-suppliers/item-suppliers.service";
import { ItemUnitsController } from "./item-units/item-units.controller";
import { ItemUnitsService } from "./item-units/item-units.service";

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
