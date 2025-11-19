import { getTranslations } from "next-intl/server";

import SectionTitle from "@/components/main/common/section-title";
import { Testimonial } from "@/types/frontend/testimonial";

import SingleTestimonial from "./single-testimonial";

const Testimonials = async () => {
  const t = await getTranslations("testimonials");

  const testimonialData: Testimonial[] = [
    {
      id: 1,
      name: t("testimonial-list.1.name"),
      designation: t("testimonial-list.1.position"),
      content: t("testimonial-list.1.feedback"),
      image: "/images/testimonials/author-01.png",
      star: 5,
    },
    {
      id: 2,
      name: t("testimonial-list.2.name"),
      designation: t("testimonial-list.2.position"),
      content: t("testimonial-list.2.feedback"),
      image: "/images/testimonials/author-02.png",
      star: 5,
    },
    {
      id: 3,
      name: t("testimonial-list.3.name"),
      designation: t("testimonial-list.3.position"),
      content: t("testimonial-list.3.feedback"),
      image: "/images/testimonials/author-03.png",
      star: 5,
    },
  ];

  return (
    <section id="testimonials" className="bg-gray-1 py-20 md:py-[120px] dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionTitle subtitle={t("subtitle")} title={t("title")} paragraph={t("description")} width="640px" center />

        <div className="mt-[60px] flex flex-wrap gap-y-8 lg:mt-20">
          {testimonialData.map((testimonial, i) => (
            <SingleTestimonial key={i} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
