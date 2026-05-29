import { api } from "./client";
import { z } from "zod";

export const ClientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

export type Client = z.infer<typeof ClientSchema>;

export async function getClients(): Promise<Client[]> {
  // TODO: Replace with actual endpoint
  return api.get<Client[]>("/clients");
}
