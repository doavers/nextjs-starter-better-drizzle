import * as z from "zod";

import { UserRole } from "@/config/role-config";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const UserFormSchema = z.object({
  image: z
    .any()
    .refine((files) => files?.length == 1, "Image is required.")
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
  name: z.string().min(2, {
    message: "User name must be at least 2 characters.",
  }),
  email: z.email(),
  role: z.enum([UserRole.SUPERADMIN as string, UserRole.ADMIN as string, UserRole.USER as string]),
  banned: z.boolean().optional(),
  ban_reason: z.string().optional(),
  ban_expires: z.date().nullable().optional(),
});

// Define a schema for input validation
export const UserSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  username: z.string().optional(),
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must have more than 8 characters").optional(),
  role: z.string().optional(),
  image: z.url().optional(),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );
