import { Suspense } from "react";

import { ManagementSearchBar, ManagementSearchBarSkeleton, PageTitle } from "@/components/common";
import { NewItemDialog, StockResultTable, StockResultTableSkeleton } from "@/components/stock";
import {
  getMockStockListCount,
  getMockStockListPage,
  universeSearchStocks,
} from "@/lib/actions/stock.action";
import { getSearchCriteria } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function StockMainSection({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) {
  const { search, page, limit } = await getSearchCriteria(searchParams);
  const [totalCount, items, universeResults] = await Promise.all([
    getMockStockListCount(search),
    getMockStockListPage(search, page, limit),
    universeSearchStocks(search),
  ]);

  return (
    <>
      <ManagementSearchBar
        totalCount={totalCount}
        searchPlaceholder="Search SKU, item, store, location..."
      />
      {search.trim().length > 0 ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          Universe search found {universeResults.length.toLocaleString()} quick matches for{" "}
          <span className="font-medium text-slate-900">{search}</span>.
        </div>
      ) : null}
      <StockResultTable
        items={items}
        search={search}
        totalCount={totalCount}
        page={page}
        limit={limit}
      />
    </>
  );
}

function StockPageLoadingFallback() {
  return (
    <>
      <ManagementSearchBarSkeleton />
      <StockResultTableSkeleton />
    </>
  );
}

const StockPage = async (props: {
  searchParams: Promise<{ search?: string; page?: string; limit?: string }>;
}) => {
  return (
    <>
      <PageTitle title="Stock Management" description="Mock stock search and inventory list" action={<NewItemDialog />} />
      <Suspense fallback={<StockPageLoadingFallback />}>
        <StockMainSection searchParams={props.searchParams} />
      </Suspense>
    </>
  );
};

export default StockPage;
