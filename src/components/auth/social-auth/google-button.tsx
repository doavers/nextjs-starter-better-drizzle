"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/common/simple-icon";
import { Button } from "@/components/ui/button";
import { AUTH_CONFIG } from "@/config/auth-config";
import { signIn } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  const t = useTranslations("auth");

  const handleSocialLogin = async () => {
    await signIn.social(
      {
        provider: "google",
        callbackURL: AUTH_CONFIG.afterLoginRedirect,
      },
      {
        onSuccess: async (ctx) => {
          // Here login via social is successful on the frontend
          console.log("Social login success", JSON.stringify(ctx));
        },
      },
    );
  };

  return (
    <Button onClick={handleSocialLogin} variant="secondary" className={cn(className)} {...props}>
      <SimpleIcon icon={siGoogle} className="size-4" />
      {t("continue-with-google")}
    </Button>
  );
}
