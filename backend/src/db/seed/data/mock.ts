import { TItemBrandInsert, TItemCategoryInsert, TItemSupplierInsert } from "src/db/schema";

export const MOCK_BRANDS = [
  {
    code: "brand1",
    name: "Brand 1",
  },
  {
    code: "brand2",
    name: "Brand 2",
  },
  {
    code: "brand3",
    name: "Brand 3",
  },
] as TItemBrandInsert[];

export const MOCK_CATEGORIES = [
  {
    code: "category1",
    name: "Category 1",
  },
  {
    code: "category2",
    name: "Category 2",
  },
  {
    code: "category3",
    name: "Category 3",
  },
] as TItemCategoryInsert[];

export const MOCK_SUPPLIERS = [
  {
    code: "supplier1",
    name: "Supplier 1",
  },
  {
    code: "supplier2",
    name: "Supplier 2",
  },
  {
    code: "supplier3",
    name: "Supplier 3",
  },
  {
    code: "supplier4",
    name: "Supplier 4",
  },
  {
    code: "supplier5",
    name: "Supplier 5",
  },
] as TItemSupplierInsert[];
