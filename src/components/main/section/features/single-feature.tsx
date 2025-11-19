import Link from "next/link";

import { Feature } from "@/types/frontend/feature";

const SingleFeature = ({ feature }: { feature: Feature }) => {
  const { icon, title, paragraph, btn, btnLink } = feature;
  return (
    <div className="w-full px-4 md:w-1/2 lg:w-1/4">
      <div className="wow fadeInUp group mb-12" data-wow-delay=".15s">
        <div className="bg-primary relative z-10 mb-8 flex h-[70px] w-[70px] items-center justify-center rounded-2xl dark:bg-slate-400">
          <span className="bg-primary bg-opacity-20 dark:bg-opacity-0 absolute top-0 left-0 z-[-1] mb-8 flex h-[70px] w-[70px] rotate-[25deg] items-center justify-center rounded-2xl duration-300 group-hover:rotate-45 dark:bg-slate-400"></span>
          {icon}
        </div>
        <h3 className="mb-3 text-xl font-bold text-black dark:text-white">{title}</h3>
        <p className="mb-8 lg:mb-11 dark:text-gray-200">{paragraph}</p>
        <Link
          href={btnLink}
          className="hover:text-primary dark:hover:text-primary text-base font-medium text-black dark:text-white"
        >
          {btn}
        </Link>
      </div>
    </div>
  );
};

export default SingleFeature;
