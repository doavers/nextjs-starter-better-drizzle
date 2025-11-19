import { FileX2 } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { LocaleSwitcher } from "@/components/common/locale-switcher";

export default async function Page() {
  const t = await getTranslations("external");
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <FileX2 className="text-primary mx-auto size-12" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t("page-not-exist")}</h1>
        <p className="text-muted-foreground mt-4">{t("page-not-exist-description")}</p>
        <div className="mt-6">
          <Link
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
            prefetch={false}
          >
            {t("go-back-home")}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-5 mx-auto justify-between px-10 text-center">
        <div className="text-sm">
          <LocaleSwitcher className="text-sm" />
        </div>
      </div>
    </div>
  );
}
