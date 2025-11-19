import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const About = async () => {
  const t = await getTranslations("about-us");
  return (
    <section id="about" className="bg-gray-1 pt-20 pb-8 lg:pt-[120px] lg:pb-[70px] dark:bg-gray-800">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap items-center">
            <div className="w-full px-4 lg:w-1/2">
              <div className="mb-12 max-w-[540px] lg:mb-0">
                <h2 className="mb-5 text-3xl leading-tight font-bold text-black sm:text-[40px] sm:leading-[1.2] dark:text-white">
                  {t("job-title")}
                </h2>
                <p className="mb-10 text-base leading-relaxed dark:text-gray-200">{t("description")}</p>

                <Link
                  href="#"
                  className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-7 py-3 text-center text-base font-medium text-white duration-300 dark:bg-slate-400"
                >
                  {t("know-more")}
                </Link>
              </div>
            </div>

            <div className="w-full px-4 lg:w-1/2">
              <div className="-mx-2 flex flex-wrap sm:-mx-4 lg:-mx-2 xl:-mx-4">
                <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4">
                  <div className={`relative mb-4 sm:mb-8 sm:h-[400px] md:h-[540px] lg:h-[400px] xl:h-[500px]`}>
                    <Image
                      src="/images/about/about-image-01.jpg"
                      alt="about image"
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4">
                  <div className="relative mb-4 sm:mb-8 sm:h-[220px] md:h-[346px] lg:mb-4 lg:h-[225px] xl:mb-8 xl:h-[310px]">
                    <Image
                      src="/images/about/about-image-02.jpg"
                      alt="about image"
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="bg-primary relative z-10 mb-4 flex items-center justify-center overflow-hidden px-6 py-12 sm:mb-8 sm:h-[160px] sm:p-5 lg:mb-4 xl:mb-8 dark:bg-slate-400">
                    <div>
                      <span className="block text-base font-semibold text-white">{t("we-have")}</span>
                      <span className="block text-5xl font-extrabold text-white">12</span>
                      <span className="text-opacity-70 block text-base font-medium text-white">
                        {t("years-of-experience")}
                      </span>
                    </div>
                    <div>
                      <span className="absolute top-0 left-0 -z-10">
                        <svg
                          width="106"
                          height="144"
                          viewBox="0 0 106 144"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.1"
                            x="-67"
                            y="47.127"
                            width="113.378"
                            height="131.304"
                            transform="rotate(-42.8643 -67 47.127)"
                            fill="url(#paint0_linear_1416_214)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_1416_214"
                              x1="-10.3111"
                              y1="47.127"
                              x2="-10.3111"
                              y2="178.431"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" />
                              <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute top-0 right-0 -z-10">
                        <svg
                          width="130"
                          height="97"
                          viewBox="0 0 130 97"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.1"
                            x="0.86792"
                            y="-6.67725"
                            width="155.563"
                            height="140.614"
                            transform="rotate(-42.8643 0.86792 -6.67725)"
                            fill="url(#paint0_linear_1416_215)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_1416_215"
                              x1="78.6495"
                              y1="-6.67725"
                              x2="78.6495"
                              y2="133.937"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" />
                              <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute right-0 bottom-0 -z-10">
                        <svg
                          width="175"
                          height="104"
                          viewBox="0 0 175 104"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.1"
                            x="175.011"
                            y="108.611"
                            width="101.246"
                            height="148.179"
                            transform="rotate(137.136 175.011 108.611)"
                            fill="url(#paint0_linear_1416_216)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_1416_216"
                              x1="225.634"
                              y1="108.611"
                              x2="225.634"
                              y2="256.79"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" />
                              <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
