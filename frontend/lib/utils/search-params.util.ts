import { format, isValid, parse } from "date-fns";

import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from "@/consts/pagination.constant";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeIsoDate(raw: string | undefined): string {
  const s = raw?.trim() ?? "";
  if (!s || !ISO_DATE.test(s)) return "";
  const d = parse(s, "yyyy-MM-dd", new Date());
  if (!isValid(d)) return "";
  return format(d, "yyyy-MM-dd");
}

export type SearchCriteriaInput = {
  search?: string;
  page?: string;
  limit?: string;
  from?: string;
  to?: string;
  status?: string;
  payment?: string;
};

export const getSearchCriteria = async (searchParams: Promise<SearchCriteriaInput>) => {
  const { search, page, limit, from, to, status, payment } = await searchParams;
  const safePage = page && Number(page) > 0 ? Number(page) : DEFAULT_PAGE;
  const safeLimit =
    limit && Number(limit) > 0 && Number(limit) <= MAX_LIMIT ? Number(limit) : DEFAULT_LIMIT;
  return {
    search: search?.trim() ?? "",
    page: safePage,
    limit: safeLimit,
    from: normalizeIsoDate(from),
    to: normalizeIsoDate(to),
    status: status?.trim() ?? "",
    payment: payment?.trim() ?? "",
  };
};
