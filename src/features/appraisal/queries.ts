import { useQuery } from "@tanstack/react-query";
import { getAppraisals, getAppraisalById } from "../../services/api/appraisal";

export const appraisalQueryKeys = {
  all: ["appraisals"] as const,
  lists: () => [...appraisalQueryKeys.all, "list"] as const,
  details: (id: string) => [...appraisalQueryKeys.all, "detail", id] as const,
};

export function useAppraisalsQuery() {
  return useQuery({
    queryKey: appraisalQueryKeys.lists(),
    queryFn: getAppraisals,
  });
}

export function useAppraisalByIdQuery(id: string) {
  return useQuery({
    queryKey: appraisalQueryKeys.details(id),
    queryFn: () => getAppraisalById(id),
    enabled: !!id,
  });
}
