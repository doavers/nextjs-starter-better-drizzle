"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { newPasswordAction } from "@/actions/auth/new-password-action";
import { FormError } from "@/components/common/form-error";
import { FormSuccess } from "@/components/common/form-success";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema } from "@/schemas/auth";

export const NewPasswordForm = ({ traceId }: { traceId: string }) => {
  const searchParams = useSearchParams();
  const token = (searchParams && searchParams.get("token")) ?? "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const t = useTranslations("auth");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      startTransition(() => {
        newPasswordAction(traceId, values, token).then((data) => {
          if (data.code === "00") setSuccess(data.message);
          else setError(data.message);
        });
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={error} />
        <FormSuccess message={success} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input id="confirmPassword" type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isPending || isLoading ? <Loader2 className="size-4 animate-spin" /> : t("new-password-title")}
        </Button>
      </form>
    </Form>
  );
};
