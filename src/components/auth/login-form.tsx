"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_CONFIG } from "@/config/auth-config";
import { getAccessToken, signIn } from "@/lib/auth-client";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations("auth");

  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    setIsLoading(true);

    try {
      const { data, error } = await signIn.email(
        {
          email: formData.email,
          password: formData.password,
          rememberMe: formData.remember,
        },
        {
          onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token"); // get the token from the response headers
            // Store the token securely (e.g., in localStorage)
            localStorage.setItem("bearer_token", authToken ?? "");

            const jwt = ctx.response.headers.get("set-auth-jwt");
            if (jwt) {
              localStorage.setItem("bearer_jwt", jwt);
            }
          },
        },
      );

      if (error) {
        toast("Login Failed!");
        return;
      }

      console.log("data", data);
      if (data) {
        // Get JWT token after login
        await getAccessToken({
          providerId: "email",
          fetchOptions: {
            onSuccess: (ctx) => {
              console.log("JWT Token:", ctx.data.token);
            },
          },
        });
      }

      toast("Login Success");
      router.push(AUTH_CONFIG.afterLoginRedirect);
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
              <FormLabel>Password</FormLabel>
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
          name="remember"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center">
              <FormControl>
                <Checkbox
                  id="login-remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="size-4"
                />
              </FormControl>
              <FormLabel htmlFor="login-remember" className="text-muted-foreground ml-1 text-sm font-medium">
                {`${t("remember-me-for")} 30 ${t("days").toLowerCase()}`}
              </FormLabel>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : t("login")}
        </Button>
      </form>
    </Form>
  );
}
