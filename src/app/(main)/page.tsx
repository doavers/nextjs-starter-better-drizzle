import { Metadata } from "next";

import ScrollUp from "@/components/common/scroll-up";
import About from "@/components/main/section/about/about";
import HomeBlogSection from "@/components/main/section/blog/home-blog-section";
import CallToAction from "@/components/main/section/call-to-action/call-to-action";
import Faq from "@/components/main/section/faq/faq";
import Features from "@/components/main/section/features/features";
import Hero from "@/components/main/section/hero/hero";
import CoreServices from "@/components/main/section/services/core-services";
import Testimonials from "@/components/main/section/testimonials/testimonials";
import blogsData from "@/data/blogs-data";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_SITE_TITLE ?? "Doavers - Build, deploy, and scale modern web applications"}`,
  description: `${process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "We create digital experiences for brands and companies by using technology."}`,
};

export default function Home() {
  return (
    <main className="z-0">
      <ScrollUp />
      <Hero />
      <Features />
      <CoreServices />
      <About />
      <CallToAction />
      <Testimonials />
      <Faq />
      <HomeBlogSection posts={blogsData} />
    </main>
  );
}
