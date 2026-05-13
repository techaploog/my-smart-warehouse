"use server";

export type MockStockItem = {
  id: string;
  sku: string;
  name: string;
  description: string;
  storeCode: string;
  storeName: string;
  locationCode: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  safetyStock: number;
  active: boolean;
  updatedAt: string;
};

const MOCK_STOCK_ITEMS: MockStockItem[] = [
  {
    id: "STK-001",
    sku: "SKU-EL-001",
    name: "Barcode Scanner",
    description: "Wireless handheld scanner for receiving and picking stations.",
    storeCode: "WH-BKK",
    storeName: "Bangkok Warehouse",
    locationCode: "A-01-01",
    quantity: 42,
    unit: "pcs",
    reorderPoint: 12,
    safetyStock: 8,
    active: true,
    updatedAt: "2026-05-12",
  },
  {
    id: "STK-002",
    sku: "SKU-PK-014",
    name: "Thermal Label Roll",
    description: "100 x 150 mm direct thermal shipping labels.",
    storeCode: "WH-BKK",
    storeName: "Bangkok Warehouse",
    locationCode: "B-02-04",
    quantity: 9,
    unit: "roll",
    reorderPoint: 20,
    safetyStock: 12,
    active: true,
    updatedAt: "2026-05-11",
  },
  {
    id: "STK-003",
    sku: "SKU-MRO-031",
    name: "Nitrile Gloves",
    description: "Powder-free safety gloves for packing operations.",
    storeCode: "WH-CNX",
    storeName: "Chiang Mai Warehouse",
    locationCode: "C-03-02",
    quantity: 180,
    unit: "box",
    reorderPoint: 50,
    safetyStock: 30,
    active: true,
    updatedAt: "2026-05-10",
  },
  {
    id: "STK-004",
    sku: "SKU-IT-008",
    name: "Tablet Dock",
    description: "Charging dock for inventory tablets.",
    storeCode: "WH-CNX",
    storeName: "Chiang Mai Warehouse",
    locationCode: "A-04-01",
    quantity: 6,
    unit: "pcs",
    reorderPoint: 5,
    safetyStock: 3,
    active: true,
    updatedAt: "2026-05-09",
  },
  {
    id: "STK-005",
    sku: "SKU-PK-022",
    name: "Stretch Film",
    description: "Clear pallet wrap for outbound shipments.",
    storeCode: "WH-BKK",
    storeName: "Bangkok Warehouse",
    locationCode: "D-01-03",
    quantity: 0,
    unit: "roll",
    reorderPoint: 18,
    safetyStock: 10,
    active: false,
    updatedAt: "2026-05-08",
  },
  {
    id: "STK-006",
    sku: "SKU-OFF-019",
    name: "Inventory Count Sheet",
    description: "Preprinted count forms for cycle count sessions.",
    storeCode: "WH-HDY",
    storeName: "Hat Yai Warehouse",
    locationCode: "OFF-01",
    quantity: 220,
    unit: "pad",
    reorderPoint: 25,
    safetyStock: 15,
    active: true,
    updatedAt: "2026-05-07",
  },
  {
    id: "STK-007",
    sku: "SKU-MRO-044",
    name: "Packing Tape",
    description: "48 mm clear tape for carton sealing.",
    storeCode: "WH-HDY",
    storeName: "Hat Yai Warehouse",
    locationCode: "B-01-06",
    quantity: 34,
    unit: "roll",
    reorderPoint: 40,
    safetyStock: 24,
    active: true,
    updatedAt: "2026-05-06",
  },
  {
    id: "STK-008",
    sku: "SKU-PPE-010",
    name: "Safety Vest",
    description: "Reflective vest for warehouse floor access.",
    storeCode: "WH-BKK",
    storeName: "Bangkok Warehouse",
    locationCode: "PPE-02",
    quantity: 64,
    unit: "pcs",
    reorderPoint: 15,
    safetyStock: 10,
    active: true,
    updatedAt: "2026-05-05",
  },
];

function stockMatchesSearch(item: MockStockItem, search: string) {
  const q = search.trim().toLowerCase();
  if (!q) return true;

  return [
    item.id,
    item.sku,
    item.name,
    item.description,
    item.storeCode,
    item.storeName,
    item.locationCode,
    item.unit,
  ].some((value) => value.toLowerCase().includes(q));
}

export async function getMockStockListCount(search: string): Promise<number> {
  return MOCK_STOCK_ITEMS.filter((item) => stockMatchesSearch(item, search)).length;
}

export async function getMockStockListPage(
  search: string,
  page: number,
  limit: number,
): Promise<MockStockItem[]> {
  const offset = (page - 1) * limit;
  return MOCK_STOCK_ITEMS.filter((item) => stockMatchesSearch(item, search))
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .slice(offset, offset + limit);
}

export async function universeSearchStocks(search: string, limit = 8): Promise<MockStockItem[]> {
  return MOCK_STOCK_ITEMS.filter((item) => stockMatchesSearch(item, search))
    .toSorted((a, b) => a.name.localeCompare(b.name))
    .slice(0, limit);
}
