import { Url } from "url";

import Link from "next/link";
import { getTranslations } from "next-intl/server";

const Breadcrumb = async ({
  pageName,
  pageDescription,
  parentPage,
}: {
  pageName: string;
  pageDescription?: string;
  parentPage?: [{ pageName: string; pageLink: string | Url }];
}) => {
  const t = await getTranslations("breadcrumb");
  return (
    <div className="relative z-10 overflow-hidden pt-[120px] pb-[30px] md:pt-[130px] md:pb-[60px] lg:pt-[160px] dark:bg-black">
      <div className="from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3 absolute bottom-0 left-0 h-px w-full bg-linear-to-r"></div>
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4">
            <div className="text-center">
              <h1 className="mb-4 text-3xl font-bold text-black sm:text-4xl md:text-[40px] md:leading-[1.2] dark:text-white">
                {pageName}
              </h1>
              <p className="mb-5 text-base dark:text-gray-200">{pageDescription}</p>

              <ul className="flex items-center justify-center gap-[10px]">
                <li>
                  <Link
                    href="/"
                    className="flex items-center gap-[10px] text-base font-medium text-black dark:text-white"
                  >
                    {t("home")}
                  </Link>
                </li>
                {parentPage &&
                  parentPage.map((parent, index) => (
                    <li key={index}>
                      <p className="flex items-center gap-[10px] text-base font-medium">
                        <span className="dark:text-gray-200"> / </span>
                        <Link href={parent.pageLink} className="text-black dark:text-white">
                          {parent.pageName}
                        </Link>
                      </p>
                    </li>
                  ))}
                <li>
                  <p className="flex items-center gap-[10px] text-base font-medium">
                    <span className="dark:text-gray-200"> / </span>
                    {pageName}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
