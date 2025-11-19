import { Metadata } from "next";

import Breadcrumb from "@/components/main/common/breadcrumb";
import Faq from "@/components/main/section/faq/faq";
import Pricing from "@/components/main/section/pricing/pricing";
import { APP_CONFIG } from "@/config/app-config";

export const metadata: Metadata = {
  title: `Pricing Page | ${APP_CONFIG.meta.title}`,
  description: "This is our pricing page",
};

const PricingPage = () => {
  return (
    <>
      <Breadcrumb pageName="Pricing" />
      <Pricing />
      <Faq />
    </>
  );
};

export default PricingPage;
