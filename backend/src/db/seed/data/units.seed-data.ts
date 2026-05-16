import { TItemUnitInsert } from "src/db/schema";

export const UNITS_DEFAULT = [
  {
    code: "pcs",
    details: "Pieces",
  },
  {
    code: "box",
    details: "Box",
  },
  {
    code: "set",
    details: "Set",
  },
  {
    code: "bag",
    details: "Bag",
  },
  {
    code: "roll",
    details: "Roll",
  },
  {
    code: "tube",
    details: "Tube",
  },
  {
    code: "pack",
    details: "Pack",
  },
  {
    code: "pair",
    details: "Pair",
  },
] as TItemUnitInsert[];
