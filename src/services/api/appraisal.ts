import { api } from "./client";
import { z } from "zod";
import { AppraisalSchema, UpsertAppraisalSchema } from "../../features/appraisal/schema";

export const AppraisalResponseSchema = AppraisalSchema;
export type Appraisal = z.infer<typeof AppraisalResponseSchema>;

export async function getAppraisals(): Promise<Appraisal[]> {
  return api.get<Appraisal[]>("/appraisal");
}

export async function getAppraisalById(id: string): Promise<Appraisal> {
  return api.get<Appraisal>(`/appraisal/${id}`);
}

export async function createAppraisal(data: z.infer<typeof UpsertAppraisalSchema>): Promise<Appraisal> {
  return api.post<Appraisal>("/appraisal", data);
}

export async function updateAppraisal(id: string, data: Partial<Appraisal>): Promise<Appraisal> {
  return api.patch<Appraisal>(`/appraisal/${id}`, data);
}

export async function sendAppraisalToReview(id: string): Promise<Appraisal> {
  return api.post<Appraisal>(`/appraisal/${id}/send-to-review`);
}
