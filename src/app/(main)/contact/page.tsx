import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import ContactSection from "@/components/main/section/contact/contact";
import { APP_CONFIG } from "@/config/app-config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return {
    title: `${APP_CONFIG.meta.title} - ${t("title")}`,
    description: `${t("description")}`,
    openGraph: {
      images: ["/images/logo/logo.png"],
    },
  };
}

const ContactPage = async () => {
  return <ContactSection />;
};

export default ContactPage;
