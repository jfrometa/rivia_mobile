import { z } from "zod";
import { AppraisalStatus } from "../../types";

// Fix for Zod v4: record takes key and value types
export const UpsertAppraisalSchema = z.object({
  applicantId: z.number().min(1),
  contactId: z.number().min(1),
  propertyType: z.string(),
  company: z.string().min(1).optional(),
  visitDate: z.date(),
  assignTo: z.string().optional(),
  comparisonExchangeRateDOPUSD: z.number().optional(),
  fields: z.record(z.string(), z.any()).optional(),
});

export type UpsertAppraisalSchemaType = z.infer<typeof UpsertAppraisalSchema>;

export const AppraisalSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  fields: z.record(z.string(), z.any()),
  propertyType: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  assignToId: z.string().optional(),
  completedById: z.string().optional(),
  createdById: z.string(),
  revisedById: z.string().optional(),
  status: z.nativeEnum(AppraisalStatus),
  revisedAt: z.string().optional(),
  completedAt: z.string().optional(),
  applicantId: z.number(),
  contactId: z.number(),
});
