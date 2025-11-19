import { Command } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default async function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const t = await getTranslations("auth");
  return (
    <main className="mx-auto max-w-screen-xl px-4">
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-10 space-y-1 px-10">
            <Command className="size-10" />
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
            </Link>
            <p className="text-sm">{t("slogan")}</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">{t("ready-to-launch")}</h2>
              <p className="text-sm">{t("ready-to-launch-description")}</p>
            </div>
            <Separator orientation="vertical" className="mx-3 h-auto!" />
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">{t("need-help")}</h2>
              <p className="text-sm">{t("need-help-description")}</p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
