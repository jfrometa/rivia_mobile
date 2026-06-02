import { z } from "zod";
import { AppraisalSchema, UpsertAppraisalSchema } from "./schema";

export type Appraisal = z.infer<typeof AppraisalSchema>;
export type UpsertAppraisalSchemaType = z.infer<typeof UpsertAppraisalSchema>;
