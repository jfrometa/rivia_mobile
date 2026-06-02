import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAppraisal, updateAppraisal, sendAppraisalToReview } from "../../services/api/appraisal";
import { appraisalQueryKeys } from "./queries";
import { UpsertAppraisalSchemaType } from "./types";

export function useCreateAppraisalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpsertAppraisalSchemaType) => {
      console.log("[useCreateAppraisalMutation] Sending data:", data);
      return createAppraisal(data);
    },
    onSuccess: (appraisal) => {
      console.log("[useCreateAppraisalMutation] Appraisal added successfully:", appraisal);
      queryClient.invalidateQueries({ queryKey: appraisalQueryKeys.lists() });
    },
    onError: (error) => {
      console.error("[useCreateAppraisalMutation] Error creating appraisal:", error);
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
