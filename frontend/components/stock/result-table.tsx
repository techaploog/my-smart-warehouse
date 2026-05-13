import { NoItem } from "@/components/common";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MockStockItem } from "@/lib/actions/stock.action";

export interface StockResultTableProps {
  items: MockStockItem[];
  search: string;
  totalCount: number;
  page: number;
  limit: number;
}

function getStockState(item: MockStockItem) {
  if (!item.active) return { label: "Inactive", className: "bg-slate-100 text-slate-600" };
  if (item.quantity <= 0) return { label: "Out", className: "bg-red-50 text-red-700" };
  if (item.quantity <= item.safetyStock) {
    return { label: "Safety", className: "bg-red-50 text-red-700" };
  }
  if (item.quantity <= item.reorderPoint) {
    return { label: "Reorder", className: "bg-amber-50 text-amber-700" };
  }
  return { label: "Healthy", className: "bg-emerald-50 text-emerald-700" };
}

export const StockResultTable = ({
  items,
  search,
  totalCount,
  page,
  limit,
}: StockResultTableProps) => {
  if (items.length === 0) {
    if (search.trim().length > 0) {
      return (
        <NoItem
          className="mt-4 min-h-[100px]"
          title="No matching stock"
          description="Try another SKU, store, location, or product name."
        />
      );
    }
    return (
      <NoItem
        className="mt-4 min-h-[100px]"
        title="No stock records yet"
        description="Stock records will appear here after the backend API is connected."
      />
    );
  }

  const start = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, totalCount);

  return (
    <div className="mt-4 w-full rounded-lg border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="w-32">Store</TableHead>
            <TableHead className="w-28">Location</TableHead>
            <TableHead className="w-24 text-right">Qty</TableHead>
            <TableHead className="w-28 text-center">Status</TableHead>
            <TableHead className="w-28">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((stock) => {
            const state = getStockState(stock);
            return (
              <TableRow key={stock.id}>
                <TableCell className="max-w-[min(100%,360px)]">
                  <span className="font-medium">{stock.name}</span>
                  <p className="text-muted-foreground truncate text-sm">
                    {stock.sku} · {stock.description}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{stock.storeCode}</span>
                  <p className="text-muted-foreground truncate text-xs">{stock.storeName}</p>
                </TableCell>
                <TableCell>{stock.locationCode}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {stock.quantity.toLocaleString()} {stock.unit}
                </TableCell>
                <TableCell className="text-center">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${state.className}`}>
                    {state.label}
                  </span>
                </TableCell>
                <TableCell>{stock.updatedAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableCaption>
          Showing {start}-{end} of {totalCount} stock records
        </TableCaption>
      </Table>
    </div>
  );
};
