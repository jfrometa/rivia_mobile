import { api } from "./client";
import { z } from "zod";

export const AppraisalSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Appraisal = z.infer<typeof AppraisalSchema>;

export async function getAppraisals(): Promise<Appraisal[]> {
  // TODO: Replace with actual endpoint
  return api.get<Appraisal[]>("/appraisals");
}

export async function getAppraisalById(id: string): Promise<Appraisal> {
  // TODO: Replace with actual endpoint
  return api.get<Appraisal>(`/appraisals/${id}`);
}

export async function createAppraisal(data: Partial<Appraisal>): Promise<Appraisal> {
  // TODO: Replace with actual endpoint
  return api.post<Appraisal>("/appraisals", data);
}

export async function updateAppraisal(id: string, data: Partial<Appraisal>): Promise<Appraisal> {
  // TODO: Replace with actual endpoint
  return api.patch<Appraisal>(`/appraisals/${id}`, data);
}

export async function sendAppraisalToReview(id: string): Promise<Appraisal> {
  // TODO: Replace with actual endpoint
  return api.post<Appraisal>(`/appraisals/${id}/send-to-review`);
}
