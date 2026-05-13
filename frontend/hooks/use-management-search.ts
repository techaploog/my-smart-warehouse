"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  LIMIT_OPTIONS,
  MAX_LIMIT,
} from "@/consts/pagination.constant";

export interface UseManagementSearchParams {
  totalCount: number;
  debounceMs?: number;
  dateRange?: boolean;
  extraResetKeys?: readonly string[];
}

function parseLimit(raw: string | null): number {
  const n = raw ? Number(raw) : NaN;
  if (Number.isFinite(n) && n > 0 && n <= MAX_LIMIT) return n;
  return DEFAULT_LIMIT;
}

export interface UseManagementSearchResult {
  inputValue: string;
  needsReset: boolean;
  safePageSelectValue: string;
  limitSelectValue: string;
  totalPages: number;
  handleSearchInputChange: (value: string) => void;
  handlePageChange: (nextPage: string) => void;
  handleLimitChange: (nextLimit: string) => void;
  handleResetSearch: () => void;
}

export interface UseDateRangeSearchResult extends UseManagementSearchResult {
  fromValue: string;
  toValue: string;
  handleFromChange: (value: string) => void;
  handleToChange: (value: string) => void;
}

export function useManagementSearch(
  params: UseManagementSearchParams & { dateRange: true },
): UseDateRangeSearchResult;
export function useManagementSearch(
  params: UseManagementSearchParams & { dateRange?: false | undefined },
): UseManagementSearchResult;
export function useManagementSearch({
  totalCount,
  debounceMs = 500,
  dateRange = false,
  extraResetKeys,
}: UseManagementSearchParams): UseManagementSearchResult | UseDateRangeSearchResult {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const pageStr = searchParams.get("page") ?? String(DEFAULT_PAGE);
  const urlSearch = searchParams.get("search") ?? "";
  const urlFrom = searchParams.get("from") ?? "";
  const urlTo = searchParams.get("to") ?? "";
  const limitNum = parseLimit(searchParams.get("limit"));

  const limitSelectValue =
    LIMIT_OPTIONS.find((limit: number) => limit === limitNum) ?? String(DEFAULT_LIMIT);

  const pageNum = (() => {
    const n = Number(pageStr);
    return Number.isFinite(n) && n > 0 ? n : DEFAULT_PAGE;
  })();

  const totalPages = Math.max(1, Math.ceil(totalCount / limitNum));

  const [inputValue, setInputValue] = useState(urlSearch);
  const [fromValue, setFromValue] = useState(urlFrom);
  const [toValue, setToValue] = useState(urlTo);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    },
    [],
  );

  const replaceUrl = (params: URLSearchParams) => {
    const q = params.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  };

  const handleSearchInputChange = (value: string) => {
    setInputValue(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const next = new URLSearchParams(searchParamsRef.current.toString());
      if (value.trim().length === 0) next.delete("search");
      else next.set("search", value);
      next.set("page", String(DEFAULT_PAGE));
      replaceUrl(next);
    }, debounceMs);
  };

  const handlePageChange = (nextPage: string) => {
    const next = new URLSearchParams(searchParamsRef.current.toString());
    next.set("page", nextPage);
    replaceUrl(next);
  };

  const handleLimitChange = (nextLimit: string) => {
    const next = new URLSearchParams(searchParamsRef.current.toString());
    next.set("limit", nextLimit);
    next.set("page", String(DEFAULT_PAGE));
    replaceUrl(next);
  };

  const setDateParam = (key: "from" | "to", value: string) => {
    const next = new URLSearchParams(searchParamsRef.current.toString());
    if (value.length === 0) next.delete(key);
    else next.set(key, value);
    next.set("page", String(DEFAULT_PAGE));
    replaceUrl(next);
  };

  const handleFromChange = (value: string) => {
    setFromValue(value);
    setDateParam("from", value);
  };

  const handleToChange = (value: string) => {
    setToValue(value);
    setDateParam("to", value);
  };

  const safePageSelectValue = String(Math.min(pageNum, totalPages));
  const needsReset =
    urlSearch.length > 0 ||
    inputValue.length > 0 ||
    pageNum !== DEFAULT_PAGE ||
    (dateRange && (urlFrom.length > 0 || urlTo.length > 0));

  const handleResetSearch = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setInputValue("");
    const next = new URLSearchParams(searchParamsRef.current.toString());
    next.delete("search");
    if (dateRange) {
      setFromValue("");
      setToValue("");
      next.delete("from");
      next.delete("to");
      extraResetKeys?.forEach((key) => next.delete(key));
    }
    next.set("page", String(DEFAULT_PAGE));
    replaceUrl(next);
  };

  const base: UseManagementSearchResult = {
    inputValue,
    needsReset,
    safePageSelectValue,
    limitSelectValue: String(limitSelectValue),
    totalPages,
    handleSearchInputChange,
    handlePageChange,
    handleLimitChange,
    handleResetSearch,
  };

  if (dateRange) {
    return {
      ...base,
      fromValue,
      toValue,
      handleFromChange,
      handleToChange,
    };
  }

  return base;
}
