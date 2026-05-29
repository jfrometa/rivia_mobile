import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const SessionSchema = z.object({
  user: UserSchema,
  accessToken: z.string(),
  refreshToken: z.string().optional(),
});

export type Session = z.infer<typeof SessionSchema>;
