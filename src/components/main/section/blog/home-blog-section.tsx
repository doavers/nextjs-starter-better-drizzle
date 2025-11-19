/* eslint-disable @typescript-eslint/no-explicit-any */
import SectionTitle from "@/components/main/common/section-title";

import SingleBlog from "./single-blog";

const HomeBlogSection = ({ posts }: any) => {
  return (
    <section className="bg-white pt-20 pb-10 lg:pt-[120px] lg:pb-20 dark:bg-black">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Our Blogs"
            title="Our Recent News"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            width="640px"
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap">
          {posts.slice(0, 3).map((blog: any, i: number) => (
            <div key={i} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <SingleBlog blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlogSection;
