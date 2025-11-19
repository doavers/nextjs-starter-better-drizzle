import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const Hero = async () => {
  const t = await getTranslations("hero");
  return (
    <section id="home" className="relative overflow-hidden pt-[120px] md:pt-[130px] lg:pt-[160px]">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4">
            <div className="hero-content wow fadeInUp mx-auto max-w-[780px] text-center" data-wow-delay=".2s">
              <h1 className="mb-6 text-3xl leading-snug font-bold text-black sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-[1.2] dark:text-white">
                {t("title")}
              </h1>
              <p className="mx-auto mb-9 max-w-[700px] text-base font-medium text-black sm:text-lg sm:leading-[1.44] dark:text-white">
                {t("description")}
              </p>
              <ul className="mb-10 flex flex-wrap items-center justify-center gap-5">
                <li>
                  <Link
                    href="/services"
                    className="shadow-1 hover:bg-gray-2 inline-flex items-center justify-center rounded-md bg-black px-7 py-[14px] text-center text-base font-medium text-white transition duration-300 ease-in-out dark:bg-white dark:text-black"
                  >
                    {t("learn-more") || "Learn More"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    target="_blank"
                    className="flex items-center gap-4 rounded-md bg-white px-6 py-[14px] text-base font-medium text-black transition duration-300 ease-in-out hover:bg-white hover:text-black"
                  >
                    {t("contact-us") || "Contact Us"}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full px-4">
            <div className="wow fadeInUp relative z-10 mx-auto max-w-[845px]" data-wow-delay=".25s">
              <div className="">
                <Image
                  src="/images/hero/hero-image-sdlc.jpg"
                  alt="hero"
                  priority={false}
                  className="mx-auto h-auto w-auto max-w-full rounded-t-xl rounded-tr-xl"
                  width={845}
                  height={316}
                />
              </div>
              <div className="absolute bottom-0 -left-9 z-[-1]">
                <svg width="134" height="106" viewBox="0 0 134 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" fill="gray" />
                  <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" fill="gray" />
                  <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" fill="gray" />
                  <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" fill="gray" />
                  <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" fill="gray" />
                  <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" fill="gray" />
                  <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" fill="gray" />
                  <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" fill="gray" />
                  <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" fill="gray" />
                  <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" fill="gray" />
                  <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" fill="gray" />
                  <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" fill="gray" />
                  <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" fill="gray" />
                  <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" fill="gray" />
                  <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" fill="gray" />
                  <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" fill="gray" />
                  <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" fill="gray" />
                  <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" fill="gray" />
                  <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" fill="gray" />
                  <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" fill="gray" />
                  <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" fill="gray" />
                  <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" fill="gray" />
                  <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" fill="gray" />
                  <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" fill="gray" />
                  <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" fill="gray" />
                  <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" fill="gray" />
                  <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" fill="gray" />
                  <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" fill="gray" />
                  <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" fill="gray" />
                  <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" fill="gray" />
                  <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" fill="gray" />
                  <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" fill="gray" />
                  <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" fill="gray" />
                  <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" fill="gray" />
                  <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" fill="gray" />
                  <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" fill="gray" />
                  <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" fill="gray" />
                  <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" fill="gray" />
                  <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" fill="gray" />
                  <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" fill="gray" />
                  <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" fill="gray" />
                  <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" fill="gray" />
                  <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" fill="gray" />
                  <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" fill="gray" />
                  <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" fill="gray" />
                  <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" fill="gray" />
                  <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" fill="gray" />
                  <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" fill="gray" />
                  <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" fill="gray" />
                  <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" fill="gray" />
                  <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" fill="gray" />
                  <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" fill="gray" />
                  <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" fill="gray" />
                  <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" fill="gray" />
                  <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" fill="gray" />
                  <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" fill="gray" />
                  <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" fill="gray" />
                  <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" fill="gray" />
                  <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" fill="gray" />
                  <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" fill="gray" />
                  <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" fill="gray" />
                  <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" fill="gray" />
                  <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" fill="gray" />
                  <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" fill="gray" />
                  <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" fill="gray" />
                  <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" fill="gray" />
                  <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" fill="gray" />
                  <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" fill="gray" />
                  <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" fill="gray" />
                  <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" fill="gray" />
                  <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" fill="gray" />
                  <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" fill="gray" />
                  <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" fill="gray" />
                  <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" fill="gray" />
                  <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" fill="gray" />
                  <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" fill="gray" />
                  <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" fill="gray" />
                  <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" fill="gray" />
                  <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" fill="gray" />
                  <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" fill="gray" />
                </svg>
              </div>
              <div className="absolute -top-6 -right-6 z-[-1]">
                <svg width="134" height="106" viewBox="0 0 134 106" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="1.66667" cy="104" r="1.66667" transform="rotate(-90 1.66667 104)" fill="gray" />
                  <circle cx="16.3333" cy="104" r="1.66667" transform="rotate(-90 16.3333 104)" fill="gray" />
                  <circle cx="31" cy="104" r="1.66667" transform="rotate(-90 31 104)" fill="gray" />
                  <circle cx="45.6667" cy="104" r="1.66667" transform="rotate(-90 45.6667 104)" fill="gray" />
                  <circle cx="60.3333" cy="104" r="1.66667" transform="rotate(-90 60.3333 104)" fill="gray" />
                  <circle cx="88.6667" cy="104" r="1.66667" transform="rotate(-90 88.6667 104)" fill="gray" />
                  <circle cx="117.667" cy="104" r="1.66667" transform="rotate(-90 117.667 104)" fill="gray" />
                  <circle cx="74.6667" cy="104" r="1.66667" transform="rotate(-90 74.6667 104)" fill="gray" />
                  <circle cx="103" cy="104" r="1.66667" transform="rotate(-90 103 104)" fill="gray" />
                  <circle cx="132" cy="104" r="1.66667" transform="rotate(-90 132 104)" fill="gray" />
                  <circle cx="1.66667" cy="89.3333" r="1.66667" transform="rotate(-90 1.66667 89.3333)" fill="gray" />
                  <circle cx="16.3333" cy="89.3333" r="1.66667" transform="rotate(-90 16.3333 89.3333)" fill="gray" />
                  <circle cx="31" cy="89.3333" r="1.66667" transform="rotate(-90 31 89.3333)" fill="gray" />
                  <circle cx="45.6667" cy="89.3333" r="1.66667" transform="rotate(-90 45.6667 89.3333)" fill="gray" />
                  <circle cx="60.3333" cy="89.3338" r="1.66667" transform="rotate(-90 60.3333 89.3338)" fill="gray" />
                  <circle cx="88.6667" cy="89.3338" r="1.66667" transform="rotate(-90 88.6667 89.3338)" fill="gray" />
                  <circle cx="117.667" cy="89.3338" r="1.66667" transform="rotate(-90 117.667 89.3338)" fill="gray" />
                  <circle cx="74.6667" cy="89.3338" r="1.66667" transform="rotate(-90 74.6667 89.3338)" fill="gray" />
                  <circle cx="103" cy="89.3338" r="1.66667" transform="rotate(-90 103 89.3338)" fill="gray" />
                  <circle cx="132" cy="89.3338" r="1.66667" transform="rotate(-90 132 89.3338)" fill="gray" />
                  <circle cx="1.66667" cy="74.6673" r="1.66667" transform="rotate(-90 1.66667 74.6673)" fill="gray" />
                  <circle cx="1.66667" cy="31.0003" r="1.66667" transform="rotate(-90 1.66667 31.0003)" fill="gray" />
                  <circle cx="16.3333" cy="74.6668" r="1.66667" transform="rotate(-90 16.3333 74.6668)" fill="gray" />
                  <circle cx="16.3333" cy="31.0003" r="1.66667" transform="rotate(-90 16.3333 31.0003)" fill="gray" />
                  <circle cx="31" cy="74.6668" r="1.66667" transform="rotate(-90 31 74.6668)" fill="gray" />
                  <circle cx="31" cy="31.0003" r="1.66667" transform="rotate(-90 31 31.0003)" fill="gray" />
                  <circle cx="45.6667" cy="74.6668" r="1.66667" transform="rotate(-90 45.6667 74.6668)" fill="gray" />
                  <circle cx="45.6667" cy="31.0003" r="1.66667" transform="rotate(-90 45.6667 31.0003)" fill="gray" />
                  <circle cx="60.3333" cy="74.6668" r="1.66667" transform="rotate(-90 60.3333 74.6668)" fill="gray" />
                  <circle cx="60.3333" cy="31.0001" r="1.66667" transform="rotate(-90 60.3333 31.0001)" fill="gray" />
                  <circle cx="88.6667" cy="74.6668" r="1.66667" transform="rotate(-90 88.6667 74.6668)" fill="gray" />
                  <circle cx="88.6667" cy="31.0001" r="1.66667" transform="rotate(-90 88.6667 31.0001)" fill="gray" />
                  <circle cx="117.667" cy="74.6668" r="1.66667" transform="rotate(-90 117.667 74.6668)" fill="gray" />
                  <circle cx="117.667" cy="31.0001" r="1.66667" transform="rotate(-90 117.667 31.0001)" fill="gray" />
                  <circle cx="74.6667" cy="74.6668" r="1.66667" transform="rotate(-90 74.6667 74.6668)" fill="gray" />
                  <circle cx="74.6667" cy="31.0001" r="1.66667" transform="rotate(-90 74.6667 31.0001)" fill="gray" />
                  <circle cx="103" cy="74.6668" r="1.66667" transform="rotate(-90 103 74.6668)" fill="gray" />
                  <circle cx="103" cy="31.0001" r="1.66667" transform="rotate(-90 103 31.0001)" fill="gray" />
                  <circle cx="132" cy="74.6668" r="1.66667" transform="rotate(-90 132 74.6668)" fill="gray" />
                  <circle cx="132" cy="31.0001" r="1.66667" transform="rotate(-90 132 31.0001)" fill="gray" />
                  <circle cx="1.66667" cy="60.0003" r="1.66667" transform="rotate(-90 1.66667 60.0003)" fill="gray" />
                  <circle cx="1.66667" cy="16.3336" r="1.66667" transform="rotate(-90 1.66667 16.3336)" fill="gray" />
                  <circle cx="16.3333" cy="60.0003" r="1.66667" transform="rotate(-90 16.3333 60.0003)" fill="gray" />
                  <circle cx="16.3333" cy="16.3336" r="1.66667" transform="rotate(-90 16.3333 16.3336)" fill="gray" />
                  <circle cx="31" cy="60.0003" r="1.66667" transform="rotate(-90 31 60.0003)" fill="gray" />
                  <circle cx="31" cy="16.3336" r="1.66667" transform="rotate(-90 31 16.3336)" fill="gray" />
                  <circle cx="45.6667" cy="60.0003" r="1.66667" transform="rotate(-90 45.6667 60.0003)" fill="gray" />
                  <circle cx="45.6667" cy="16.3336" r="1.66667" transform="rotate(-90 45.6667 16.3336)" fill="gray" />
                  <circle cx="60.3333" cy="60.0003" r="1.66667" transform="rotate(-90 60.3333 60.0003)" fill="gray" />
                  <circle cx="60.3333" cy="16.3336" r="1.66667" transform="rotate(-90 60.3333 16.3336)" fill="gray" />
                  <circle cx="88.6667" cy="60.0003" r="1.66667" transform="rotate(-90 88.6667 60.0003)" fill="gray" />
                  <circle cx="88.6667" cy="16.3336" r="1.66667" transform="rotate(-90 88.6667 16.3336)" fill="gray" />
                  <circle cx="117.667" cy="60.0003" r="1.66667" transform="rotate(-90 117.667 60.0003)" fill="gray" />
                  <circle cx="117.667" cy="16.3336" r="1.66667" transform="rotate(-90 117.667 16.3336)" fill="gray" />
                  <circle cx="74.6667" cy="60.0003" r="1.66667" transform="rotate(-90 74.6667 60.0003)" fill="gray" />
                  <circle cx="74.6667" cy="16.3336" r="1.66667" transform="rotate(-90 74.6667 16.3336)" fill="gray" />
                  <circle cx="103" cy="60.0003" r="1.66667" transform="rotate(-90 103 60.0003)" fill="gray" />
                  <circle cx="103" cy="16.3336" r="1.66667" transform="rotate(-90 103 16.3336)" fill="gray" />
                  <circle cx="132" cy="60.0003" r="1.66667" transform="rotate(-90 132 60.0003)" fill="gray" />
                  <circle cx="132" cy="16.3336" r="1.66667" transform="rotate(-90 132 16.3336)" fill="gray" />
                  <circle cx="1.66667" cy="45.3336" r="1.66667" transform="rotate(-90 1.66667 45.3336)" fill="gray" />
                  <circle cx="1.66667" cy="1.66683" r="1.66667" transform="rotate(-90 1.66667 1.66683)" fill="gray" />
                  <circle cx="16.3333" cy="45.3336" r="1.66667" transform="rotate(-90 16.3333 45.3336)" fill="gray" />
                  <circle cx="16.3333" cy="1.66683" r="1.66667" transform="rotate(-90 16.3333 1.66683)" fill="gray" />
                  <circle cx="31" cy="45.3336" r="1.66667" transform="rotate(-90 31 45.3336)" fill="gray" />
                  <circle cx="31" cy="1.66683" r="1.66667" transform="rotate(-90 31 1.66683)" fill="gray" />
                  <circle cx="45.6667" cy="45.3336" r="1.66667" transform="rotate(-90 45.6667 45.3336)" fill="gray" />
                  <circle cx="45.6667" cy="1.66683" r="1.66667" transform="rotate(-90 45.6667 1.66683)" fill="gray" />
                  <circle cx="60.3333" cy="45.3338" r="1.66667" transform="rotate(-90 60.3333 45.3338)" fill="gray" />
                  <circle cx="60.3333" cy="1.66707" r="1.66667" transform="rotate(-90 60.3333 1.66707)" fill="gray" />
                  <circle cx="88.6667" cy="45.3338" r="1.66667" transform="rotate(-90 88.6667 45.3338)" fill="gray" />
                  <circle cx="88.6667" cy="1.66707" r="1.66667" transform="rotate(-90 88.6667 1.66707)" fill="gray" />
                  <circle cx="117.667" cy="45.3338" r="1.66667" transform="rotate(-90 117.667 45.3338)" fill="gray" />
                  <circle cx="117.667" cy="1.66707" r="1.66667" transform="rotate(-90 117.667 1.66707)" fill="gray" />
                  <circle cx="74.6667" cy="45.3338" r="1.66667" transform="rotate(-90 74.6667 45.3338)" fill="gray" />
                  <circle cx="74.6667" cy="1.66707" r="1.66667" transform="rotate(-90 74.6667 1.66707)" fill="gray" />
                  <circle cx="103" cy="45.3338" r="1.66667" transform="rotate(-90 103 45.3338)" fill="gray" />
                  <circle cx="103" cy="1.66707" r="1.66667" transform="rotate(-90 103 1.66707)" fill="gray" />
                  <circle cx="132" cy="45.3338" r="1.66667" transform="rotate(-90 132 45.3338)" fill="gray" />
                  <circle cx="132" cy="1.66707" r="1.66667" transform="rotate(-90 132 1.66707)" fill="gray" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
