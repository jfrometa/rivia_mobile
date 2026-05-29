import { api } from "./client";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export async function getUsers(): Promise<User[]> {
  // TODO: Replace with actual endpoint
  return api.get<User[]>("/users");
}
