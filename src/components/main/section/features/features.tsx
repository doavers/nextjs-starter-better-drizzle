import { getTranslations } from "next-intl/server";

import SectionTitle from "@/components/main/common/section-title";

import FeaturesData from "./features-data";
import SingleFeature from "./single-feature";

const Features = async () => {
  const t = await getTranslations("features");
  const feature = FeaturesData();
  const featuresData = await feature;
  return (
    <section className="pt-20 pb-8 lg:pt-[120px] lg:pb-[70px] dark:bg-black dark:text-white">
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionTitle subtitle={t("subtitle")} title={t("title")} paragraph={t("paragraph")} />

        <div className="-mx-4 mt-12 flex flex-wrap lg:mt-20">
          {featuresData.map((feature, i) => (
            <SingleFeature key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
