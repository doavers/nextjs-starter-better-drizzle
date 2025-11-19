"use client";

import SectionTitle from "@/components/main/common/section-title";
import { pricingData } from "@/data/pricing-data";

import PricingBox from "./pricing-box";

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="relative z-20 overflow-hidden bg-white pt-20 pb-12 lg:pt-[120px] lg:pb-[90px] dark:bg-black"
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Pricing Table"
            title="Our Pricing Plan"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {pricingData.map((product) => (
            <PricingBox key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
