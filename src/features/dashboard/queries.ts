import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../../services/api/dashboard";

export const dashboardQueryKeys = {
  all: ["dashboard"] as const,
  summary: () => [...dashboardQueryKeys.all, "summary"] as const,
};

export function useDashboardSummaryQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.summary(),
    queryFn: getDashboardSummary,
  });
}
