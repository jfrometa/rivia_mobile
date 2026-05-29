import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppraisal, updateAppraisal, sendAppraisalToReview } from "../../services/api/appraisal";
import { appraisalQueryKeys } from "./queries";

export function useCreateAppraisalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppraisal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.lists() });
    },
  });
}

export function useUpdateAppraisalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAppraisal(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.details(variables.id) });
    },
  });
}

export function useSendAppraisalToReviewMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendAppraisalToReview,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.details(id) });
    },
  });
}
