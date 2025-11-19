/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";

export const RegisterSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required",
    }),
    email: z
      .string()
      .email({
        message: "Email is required",
      })
      .min(8, "Password must have than 8 characters"),
    password: z.string().min(6, {
      message: "Minimum 6 characters required",
    }),
    confirmPassword: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data: any) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export const RegisterApiSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().optional(),
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must have more than 8 characters"),
  role: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .min(8, "Password must have than 8 characters"),
  code: z.optional(z.string()),
});

export const LoginApiSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(1, {
      message: "Password is required",
    })
    .min(8, "Password must have than 8 characters"),
});

export const ResetSchema = z.object({
  email: z.email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  confirmPassword: z.string().min(8, {
    message: "Confirm Password must be at least 8 characters.",
  }),
});

export const NewPasswordApiSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum of 8 characters required",
  }),
  token: z.string().min(64, {
    message: "Token is required",
  }),
});
