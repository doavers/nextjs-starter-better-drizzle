import { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import Breadcrumb from "@/components/main/common/breadcrumb";
import SectionHeader from "@/components/main/common/section-header";
import Services from "@/components/main/section/services/services";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: `Our Services | ${APP_CONFIG.meta.title}`,
  description: "This is our sevices page",
};

const AboutPage = async () => {
  const t = await getTranslations("services");
  return (
    <main>
      <Breadcrumb pageName={t("title")} />
      <Services />
      <div className="mx-auto px-4 pt-24 md:px-8 xl:px-0">
        {/* <!-- Section Title Start --> */}
        <SectionHeader
          headerInfo={{
            title: t("explore-our"),
            subtitle: t("latest-projects"),
            description: t("portfolio-description"),
          }}
        />
        {/* <!-- Section Title End --> */}
        <div className="mx-auto mt-12 mb-32 max-w-screen-sm text-center">
          <Link
            href="/portfolio"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-7 py-3 text-center text-base font-medium text-white duration-300 dark:bg-slate-400"
          >
            {t("explore-our-portfolio")}
          </Link>
        </div>
      </div>
    </main>
  );
};

export default AboutPage;
