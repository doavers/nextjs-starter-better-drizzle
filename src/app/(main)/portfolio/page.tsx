import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Breadcrumb from "@/components/main/common/breadcrumb";
import PortfolioTab from "@/components/main/section/portfolio/portfolio-tab";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: `Our Portfolio | ${APP_CONFIG.meta.title}`,
  description: "This is our portfolio page",
};

const PortfolioPage = async () => {
  const t = await getTranslations("portfolio");
  return (
    <main>
      <Breadcrumb pageName={t("title")} />

      <PortfolioTab />
    </main>
  );
};

export default PortfolioPage;
