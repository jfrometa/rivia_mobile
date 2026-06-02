import { api } from "./client";
import { z } from "zod";
import { AppraisalSchema, UpsertAppraisalSchema } from "../../features/appraisal/schema";

export const AppraisalResponseSchema = AppraisalSchema;
export type Appraisal = z.infer<typeof AppraisalResponseSchema>;

export async function getAppraisals(): Promise<Appraisal[]> {
  const response = await api.get<{ data: { data: Appraisal[] } }>("/appraisal/list");
  return response.data.data.map(appraisal => {
    if (typeof appraisal.fields === 'string') {
      return { ...appraisal, fields: JSON.parse(appraisal.fields) };
    }
    return appraisal;
  });
}

export async function getAppraisalById(id: string): Promise<Appraisal> {
  const response = await api.get<{ data: { data: Appraisal } }>(`/appraisal/${id}`);
  const appraisal = response.data.data;
  if (typeof appraisal.fields === 'string') {
    return { ...appraisal, fields: JSON.parse(appraisal.fields) };
  }
  return appraisal;
}

export async function createAppraisal(data: z.infer<typeof UpsertAppraisalSchema>): Promise<Appraisal> {
  const response = await api.post<{ data: { data: Appraisal } }>("/appraisal", data);
  const appraisal = response.data.data;
  if (typeof appraisal.fields === 'string') {
    return { ...appraisal, fields: JSON.parse(appraisal.fields) };
  }
  return appraisal;
}

export async function updateAppraisal(id: string, data: Partial<Appraisal>): Promise<Appraisal> {
  const response = await api.patch<{ data: { data: Appraisal } }>(`/appraisal/${id}`, data);
  const appraisal = response.data.data;
  if (typeof appraisal.fields === 'string') {
    return { ...appraisal, fields: JSON.parse(appraisal.fields) };
  }
  return appraisal;
}

export async function sendAppraisalToReview(id: string): Promise<Appraisal> {
  const response = await api.post<{ data: { data: Appraisal } }>(`/appraisal/${id}/send-to-review`);
  const appraisal = response.data.data;
  if (typeof appraisal.fields === 'string') {
    return { ...appraisal, fields: JSON.parse(appraisal.fields) };
  }
  return appraisal;
}
