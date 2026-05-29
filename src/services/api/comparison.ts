import { api } from "./client";
import { z } from "zod";

export const ComparisonSchema = z.object({
  id: z.string(),
  address: z.string(),
  price: z.number(),
});

export type Comparison = z.infer<typeof ComparisonSchema>;

export async function getComparisons(): Promise<Comparison[]> {
  // TODO: Replace with actual endpoint
  return api.get<Comparison[]>("/comparisons");
}
