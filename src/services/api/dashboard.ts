import { api } from "./client";
import { z } from "zod";

export const DashboardSummarySchema = z.object({
  totalAppraisals: z.number(),
  pendingReviews: z.number(),
  activeClients: z.number(),
});

export type DashboardSummary = z.infer<typeof DashboardSummarySchema>;

export async function getDashboardSummary(): Promise<DashboardSummary> {
  // TODO: Replace with actual endpoint
  return api.get<DashboardSummary>("/dashboard/summary");
}
