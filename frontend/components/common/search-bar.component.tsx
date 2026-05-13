"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LIMIT_OPTIONS } from "@/consts/pagination.constant";
import { useManagementSearch } from "@/hooks";

export interface ManagementSearchBarProps {
  totalCount: number;
  searchPlaceholder: string;
}

export const ManagementSearchBarSkeleton = () => (
  <div className="flex-between w-full flex-wrap gap-2 rounded-lg border border-slate-300 p-2 shadow-md">
    <div className="flex w-full flex-1 items-center gap-2 md:max-w-[340px]">
      <Skeleton className="h-8 min-w-0 flex-1" />
      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
    </div>
    <div className="flex flex-wrap gap-2">
      <Skeleton className="h-8 w-28" />
      <Skeleton className="h-8 w-32" />
    </div>
  </div>
);

export const ManagementSearchBar = ({
  totalCount,
  searchPlaceholder,
}: ManagementSearchBarProps) => {
  const {
    inputValue,
    needsReset,
    safePageSelectValue,
    limitSelectValue,
    totalPages,
    handleSearchInputChange,
    handlePageChange,
    handleLimitChange,
    handleResetSearch,
  } = useManagementSearch({ totalCount });

  return (
    <div className="flex-between w-full flex-col gap-4 rounded-lg border border-slate-300 p-4 shadow-md md:flex-row">
      <div className="flex w-full min-w-0 items-center gap-2 md:max-w-[380px]">
        <Input
          name="search"
          placeholder={searchPlaceholder}
          autoComplete="off"
          className="min-w-0 flex-1"
          value={inputValue}
          onChange={(e) => handleSearchInputChange(e.target.value)}
        />
        {needsReset ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={handleResetSearch}
            title="Clear search and return to the first page"
            aria-label="Clear search and return to the first page"
          >
            <XIcon className="size-4" />
          </Button>
        ) : null}
      </div>
      <div className="flex-between w-full items-center gap-4 md:w-auto">
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">Page</span>
          <Select value={safePageSelectValue} onValueChange={handlePageChange}>
            <SelectTrigger>
              <SelectValue placeholder="Page" />
            </SelectTrigger>
            <SelectContent position="popper">
              {Array.from({ length: totalPages }, (_, i) => {
                const p = i + 1;
                return (
                  <SelectItem key={p} value={String(p)}>
                    {p}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground shrink-0 text-sm whitespace-nowrap">Rows</span>
          <Select value={String(limitSelectValue)} onValueChange={handleLimitChange}>
            <SelectTrigger>
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent position="popper">
              {LIMIT_OPTIONS.map((limit: number) => (
                <SelectItem key={limit} value={String(limit)}>
                  {limit.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
