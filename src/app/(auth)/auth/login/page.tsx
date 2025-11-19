import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/auth/login-form";
import { GoogleButton } from "@/components/auth/social-auth/google-button";
import { LocaleSwitcher } from "@/components/common/locale-switcher";
import { APP_CONFIG } from "@/config/app-config";
import { auth } from "@/lib/auth";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth");
  return {
    title: `${APP_CONFIG.meta.title} - ${t("login")}`,
    description: APP_CONFIG.meta.description,
    openGraph: {
      images: ["/images/logo/logo.png"],
    },
  };
}

export default async function LoginV2() {
  const t = await getTranslations("auth");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return (
    <>
      <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[350px]">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-medium">{t("login-to-your-account")}</h1>
          <p className="text-muted-foreground text-sm">{t("login-description")}</p>
        </div>
        <div className="space-y-4">
          <GoogleButton className="w-full" />
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">{t("or-continue-with")}</span>
          </div>
          <LoginForm />
        </div>
      </div>

      <div className="absolute top-5 flex w-full flex-col justify-end space-y-2 text-right lg:px-10">
        <div className="text-muted-foreground text-sm">
          {t("dont-have-an-account") + " "}
          <Link className="text-foreground" href="register">
            {t("register")}
          </Link>
        </div>
        <div className="text-muted-foreground text-sm">
          {t("forgot-your-password") + " "}
          <Link className="text-foreground" href="forgot-password">
            {t("forgot-password")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-5 flex w-full justify-between lg:px-10">
        <div className="text-sm">
          {t("build-with-love")} |{" "}
          <Link href={"/"} className="font-bold">
            {APP_CONFIG.copyright}
          </Link>{" "}
          {/* {t("all-rights-reserved")} */}
        </div>
        <div className="flex items-center gap-1 text-sm">
          <LocaleSwitcher className="text-sm" />
        </div>
      </div>
    </>
  );
}
