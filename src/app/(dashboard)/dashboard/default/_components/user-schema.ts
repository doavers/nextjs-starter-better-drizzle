import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  emailVerified: z.boolean(),
  banned: z.boolean(),
  createdAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
