import * as z from "zod";

export const OrganizationFormSchema = z.object({
  name: z.string().min(1, "Organization name is required").max(100, "Name must be less than 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(50, "Slug must be less than 50 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  logo: z.string().optional(),
  metadata: z.string().optional(),
});

export type OrganizationFormData = z.infer<typeof OrganizationFormSchema>;
