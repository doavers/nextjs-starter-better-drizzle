import { getTranslations } from "next-intl/server";

import SectionTitle from "@/components/main/common/section-title";

import SingleFaq from "./single-faq";

const Faq = async () => {
  const t = await getTranslations("faq");
  return (
    <section
      id="faq"
      className="relative z-20 overflow-hidden bg-white pt-20 pb-8 lg:pt-[120px] lg:pb-[50px] dark:bg-black"
    >
      <div className="mx-auto max-w-screen-xl px-4">
        <SectionTitle subtitle={t("subtitle")} title={t("title")} paragraph={t("description")} width="640px" center />

        <div className="-mx-4 mt-[60px] flex flex-wrap lg:mt-20">
          <div className="w-full px-4 lg:w-1/2">
            <SingleFaq question={t("faq-list.1.question")} answer={t("faq-list.1.answer")} />
            <SingleFaq question={t("faq-list.2.question")} answer={t("faq-list.2.answer")} />
            <SingleFaq question={t("faq-list.3.question")} answer={t("faq-list.3.answer")} />
          </div>

          <div className="w-full px-4 lg:w-1/2">
            <SingleFaq question={t("faq-list.4.question")} answer={t("faq-list.4.answer")} />
            <SingleFaq question={t("faq-list.5.question")} answer={t("faq-list.5.answer")} />
            <SingleFaq question={t("faq-list.6.question")} answer={t("faq-list.6.answer")} />
          </div>
        </div>
      </div>

      <div>
        <span className="absolute top-4 left-4 -z-1">
          <svg width="48" height="134" viewBox="0 0 48 134" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45.6673" cy="132" r="1.66667" transform="rotate(180 45.6673 132)" fill="#13C296" />
            <circle cx="45.6673" cy="117.333" r="1.66667" transform="rotate(180 45.6673 117.333)" fill="#13C296" />
            <circle cx="45.6673" cy="102.667" r="1.66667" transform="rotate(180 45.6673 102.667)" fill="#13C296" />
            <circle cx="45.6673" cy="88.0001" r="1.66667" transform="rotate(180 45.6673 88.0001)" fill="#13C296" />
            <circle cx="45.6673" cy="73.3335" r="1.66667" transform="rotate(180 45.6673 73.3335)" fill="#13C296" />
            <circle cx="45.6673" cy="45.0001" r="1.66667" transform="rotate(180 45.6673 45.0001)" fill="#13C296" />
            <circle cx="45.6673" cy="16.0001" r="1.66667" transform="rotate(180 45.6673 16.0001)" fill="#13C296" />
            <circle cx="45.6673" cy="59.0001" r="1.66667" transform="rotate(180 45.6673 59.0001)" fill="#13C296" />
            <circle cx="45.6673" cy="30.6668" r="1.66667" transform="rotate(180 45.6673 30.6668)" fill="#13C296" />
            <circle cx="45.6673" cy="1.66683" r="1.66667" transform="rotate(180 45.6673 1.66683)" fill="#13C296" />
            <circle cx="31.0013" cy="132" r="1.66667" transform="rotate(180 31.0013 132)" fill="#13C296" />
            <circle cx="31.0013" cy="117.333" r="1.66667" transform="rotate(180 31.0013 117.333)" fill="#13C296" />
            <circle cx="31.0013" cy="102.667" r="1.66667" transform="rotate(180 31.0013 102.667)" fill="#13C296" />
            <circle cx="31.0013" cy="88.0001" r="1.66667" transform="rotate(180 31.0013 88.0001)" fill="#13C296" />
            <circle cx="31.0013" cy="73.3335" r="1.66667" transform="rotate(180 31.0013 73.3335)" fill="#13C296" />
            <circle cx="31.0013" cy="45.0001" r="1.66667" transform="rotate(180 31.0013 45.0001)" fill="#13C296" />
            <circle cx="31.0013" cy="16.0001" r="1.66667" transform="rotate(180 31.0013 16.0001)" fill="#13C296" />
            <circle cx="31.0013" cy="59.0001" r="1.66667" transform="rotate(180 31.0013 59.0001)" fill="#13C296" />
            <circle cx="31.0013" cy="30.6668" r="1.66667" transform="rotate(180 31.0013 30.6668)" fill="#13C296" />
            <circle cx="31.0013" cy="1.66683" r="1.66667" transform="rotate(180 31.0013 1.66683)" fill="#13C296" />
            <circle cx="16.3333" cy="132" r="1.66667" transform="rotate(180 16.3333 132)" fill="#13C296" />
            <circle cx="16.3333" cy="117.333" r="1.66667" transform="rotate(180 16.3333 117.333)" fill="#13C296" />
            <circle cx="16.3333" cy="102.667" r="1.66667" transform="rotate(180 16.3333 102.667)" fill="#13C296" />
            <circle cx="16.3333" cy="88.0001" r="1.66667" transform="rotate(180 16.3333 88.0001)" fill="#13C296" />
            <circle cx="16.3333" cy="73.3335" r="1.66667" transform="rotate(180 16.3333 73.3335)" fill="#13C296" />
            <circle cx="16.3333" cy="45.0001" r="1.66667" transform="rotate(180 16.3333 45.0001)" fill="#13C296" />
            <circle cx="16.3333" cy="16.0001" r="1.66667" transform="rotate(180 16.3333 16.0001)" fill="#13C296" />
            <circle cx="16.3333" cy="59.0001" r="1.66667" transform="rotate(180 16.3333 59.0001)" fill="#13C296" />
            <circle cx="16.3333" cy="30.6668" r="1.66667" transform="rotate(180 16.3333 30.6668)" fill="#13C296" />
            <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(180 16.3333 1.66683)" fill="#13C296" />
            <circle cx="1.66732" cy="132" r="1.66667" transform="rotate(180 1.66732 132)" fill="#13C296" />
            <circle cx="1.66732" cy="117.333" r="1.66667" transform="rotate(180 1.66732 117.333)" fill="#13C296" />
            <circle cx="1.66732" cy="102.667" r="1.66667" transform="rotate(180 1.66732 102.667)" fill="#13C296" />
            <circle cx="1.66732" cy="88.0001" r="1.66667" transform="rotate(180 1.66732 88.0001)" fill="#13C296" />
            <circle cx="1.66732" cy="73.3335" r="1.66667" transform="rotate(180 1.66732 73.3335)" fill="#13C296" />
            <circle cx="1.66732" cy="45.0001" r="1.66667" transform="rotate(180 1.66732 45.0001)" fill="#13C296" />
            <circle cx="1.66732" cy="16.0001" r="1.66667" transform="rotate(180 1.66732 16.0001)" fill="#13C296" />
            <circle cx="1.66732" cy="59.0001" r="1.66667" transform="rotate(180 1.66732 59.0001)" fill="#13C296" />
            <circle cx="1.66732" cy="30.6668" r="1.66667" transform="rotate(180 1.66732 30.6668)" fill="#13C296" />
            <circle cx="1.66732" cy="1.66683" r="1.66667" transform="rotate(180 1.66732 1.66683)" fill="#13C296" />
          </svg>
        </span>
        <span className="absolute right-4 bottom-4 -z-1">
          <svg width="48" height="134" viewBox="0 0 48 134" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="45.6673" cy="132" r="1.66667" transform="rotate(180 45.6673 132)" fill="#3758F9" />
            <circle cx="45.6673" cy="117.333" r="1.66667" transform="rotate(180 45.6673 117.333)" fill="#3758F9" />
            <circle cx="45.6673" cy="102.667" r="1.66667" transform="rotate(180 45.6673 102.667)" fill="#3758F9" />
            <circle cx="45.6673" cy="88.0001" r="1.66667" transform="rotate(180 45.6673 88.0001)" fill="#3758F9" />
            <circle cx="45.6673" cy="73.3333" r="1.66667" transform="rotate(180 45.6673 73.3333)" fill="#3758F9" />
            <circle cx="45.6673" cy="45.0001" r="1.66667" transform="rotate(180 45.6673 45.0001)" fill="#3758F9" />
            <circle cx="45.6673" cy="16.0001" r="1.66667" transform="rotate(180 45.6673 16.0001)" fill="#3758F9" />
            <circle cx="45.6673" cy="59.0001" r="1.66667" transform="rotate(180 45.6673 59.0001)" fill="#3758F9" />
            <circle cx="45.6673" cy="30.6668" r="1.66667" transform="rotate(180 45.6673 30.6668)" fill="#3758F9" />
            <circle cx="45.6673" cy="1.66683" r="1.66667" transform="rotate(180 45.6673 1.66683)" fill="#3758F9" />
            <circle cx="31.0006" cy="132" r="1.66667" transform="rotate(180 31.0006 132)" fill="#3758F9" />
            <circle cx="31.0006" cy="117.333" r="1.66667" transform="rotate(180 31.0006 117.333)" fill="#3758F9" />
            <circle cx="31.0006" cy="102.667" r="1.66667" transform="rotate(180 31.0006 102.667)" fill="#3758F9" />
            <circle cx="31.0006" cy="88.0001" r="1.66667" transform="rotate(180 31.0006 88.0001)" fill="#3758F9" />
            <circle cx="31.0008" cy="73.3333" r="1.66667" transform="rotate(180 31.0008 73.3333)" fill="#3758F9" />
            <circle cx="31.0008" cy="45.0001" r="1.66667" transform="rotate(180 31.0008 45.0001)" fill="#3758F9" />
            <circle cx="31.0008" cy="16.0001" r="1.66667" transform="rotate(180 31.0008 16.0001)" fill="#3758F9" />
            <circle cx="31.0008" cy="59.0001" r="1.66667" transform="rotate(180 31.0008 59.0001)" fill="#3758F9" />
            <circle cx="31.0008" cy="30.6668" r="1.66667" transform="rotate(180 31.0008 30.6668)" fill="#3758F9" />
            <circle cx="31.0008" cy="1.66683" r="1.66667" transform="rotate(180 31.0008 1.66683)" fill="#3758F9" />
            <circle cx="16.3341" cy="132" r="1.66667" transform="rotate(180 16.3341 132)" fill="#3758F9" />
            <circle cx="16.3341" cy="117.333" r="1.66667" transform="rotate(180 16.3341 117.333)" fill="#3758F9" />
            <circle cx="16.3341" cy="102.667" r="1.66667" transform="rotate(180 16.3341 102.667)" fill="#3758F9" />
            <circle cx="16.3341" cy="88.0001" r="1.66667" transform="rotate(180 16.3341 88.0001)" fill="#3758F9" />
            <circle cx="16.3338" cy="73.3333" r="1.66667" transform="rotate(180 16.3338 73.3333)" fill="#3758F9" />
            <circle cx="16.3338" cy="45.0001" r="1.66667" transform="rotate(180 16.3338 45.0001)" fill="#3758F9" />
            <circle cx="16.3338" cy="16.0001" r="1.66667" transform="rotate(180 16.3338 16.0001)" fill="#3758F9" />
            <circle cx="16.3338" cy="59.0001" r="1.66667" transform="rotate(180 16.3338 59.0001)" fill="#3758F9" />
            <circle cx="16.3338" cy="30.6668" r="1.66667" transform="rotate(180 16.3338 30.6668)" fill="#3758F9" />
            <circle cx="16.3338" cy="1.66683" r="1.66667" transform="rotate(180 16.3338 1.66683)" fill="#3758F9" />
            <circle cx="1.66732" cy="132" r="1.66667" transform="rotate(180 1.66732 132)" fill="#3758F9" />
            <circle cx="1.66732" cy="117.333" r="1.66667" transform="rotate(180 1.66732 117.333)" fill="#3758F9" />
            <circle cx="1.66732" cy="102.667" r="1.66667" transform="rotate(180 1.66732 102.667)" fill="#3758F9" />
            <circle cx="1.66732" cy="88.0001" r="1.66667" transform="rotate(180 1.66732 88.0001)" fill="#3758F9" />
            <circle cx="1.66732" cy="73.3333" r="1.66667" transform="rotate(180 1.66732 73.3333)" fill="#3758F9" />
            <circle cx="1.66732" cy="45.0001" r="1.66667" transform="rotate(180 1.66732 45.0001)" fill="#3758F9" />
            <circle cx="1.66732" cy="16.0001" r="1.66667" transform="rotate(180 1.66732 16.0001)" fill="#3758F9" />
            <circle cx="1.66732" cy="59.0001" r="1.66667" transform="rotate(180 1.66732 59.0001)" fill="#3758F9" />
            <circle cx="1.66732" cy="30.6668" r="1.66667" transform="rotate(180 1.66732 30.6668)" fill="#3758F9" />
            <circle cx="1.66732" cy="1.66683" r="1.66667" transform="rotate(180 1.66732 1.66683)" fill="#3758F9" />
          </svg>
        </span>
      </div>
    </section>
  );
};

export default Faq;
