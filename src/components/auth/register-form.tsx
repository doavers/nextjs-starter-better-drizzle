"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth-client";

const FormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long!"),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const t = useTranslations("auth");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const { error } = await signUp.email({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast("Failed to create account. Please try again");
        return;
      }
      toast("Your account has been created successfully. Please sign in with email & password");

      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("name")}</FormLabel>
              <FormControl>
                <Input id="name" type="text" placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email-address")}</FormLabel>
              <FormControl>
                <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    // disabled={isPending}
                    disabled={isLoading}
                    placeholder="******"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                  />
                  <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                    {showPassword ? (
                      <EyeOff
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <Eye
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPassword(!showPassword);
                        }}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirm-password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="******"
                    autoComplete="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                  />
                  <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                    {showConfirmPassword ? (
                      <EyeOff
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      />
                    ) : (
                      <Eye
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowConfirmPassword(!showConfirmPassword);
                        }}
                      />
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : t("register")}
        </Button>
      </form>
    </Form>
  );
}
