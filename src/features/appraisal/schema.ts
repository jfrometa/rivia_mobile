import { z } from "zod";

export const AppraisalSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  status: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
