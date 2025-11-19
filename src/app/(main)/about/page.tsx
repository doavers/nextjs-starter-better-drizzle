import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import Breadcrumb from "@/components/main/common/breadcrumb";
import About from "@/components/main/section/about/about";
import { APP_CONFIG } from "@/config/app-config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about-us");
  return {
    title: `${APP_CONFIG.meta.title} - ${t("title")}`,
    description: `${t("description")}`,
    openGraph: {
      images: ["/images/logo/logo.png"],
    },
  };
}

const AboutPage = async () => {
  const t = await getTranslations("about-us");
  return (
    <main>
      <Breadcrumb pageName={t("title")} />
      <About />
    </main>
  );
};

export default AboutPage;
