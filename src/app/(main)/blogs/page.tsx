import { Metadata } from "next";

import Breadcrumb from "@/components/main/common/breadcrumb";
import SingleBlog from "@/components/main/section/blog/single-blog";
import { APP_CONFIG } from "@/config/app-config";
import { getAllPosts } from "@/lib/markdown";

export const metadata: Metadata = {
  title: `Blogs | ${APP_CONFIG.meta.title}`,
  description: "Blogs page of " + APP_CONFIG.meta.title,
};

const Blog = () => {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

  return (
    <>
      <Breadcrumb pageName="Blogs" />

      <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
