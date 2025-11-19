import { Metadata } from "next";

import MarkdownRenderer from "@/components/docs/markdown-renderer";
import MermaidProvider from "@/components/docs/mermaid-provider";
import SidebarServer from "@/components/docs/sidebar-server";
import { APP_CONFIG } from "@/config/app-config";
import { getDocBySlug } from "@/lib/docs-reader";

export const metadata: Metadata = {
  title: `Documentation | ${APP_CONFIG.meta.title}`,
  description: `Comprehensive documentation for ${APP_CONFIG.meta.title} including setup guides, API references, and architecture documentation.`,
};

export default function DocsPage() {
  const readmeDoc = getDocBySlug("README");

  if (!readmeDoc) {
    return (
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Documentation Not Available</h1>
            <p className="text-gray-600 dark:text-gray-400">
              The documentation files could not be found. Please ensure the docs directory exists and contains markdown
              files.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <MermaidProvider>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            {/* Sidebar */}
            <div className="w-full px-4 lg:w-1/4">
              <div className="shadow-solid-4 dark:border-strokedark dark:bg-blacksection sticky top-[74px] rounded-lg border border-white p-4 transition-all">
                <ul className="space-y-2">
                  <SidebarServer />
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 lg:w-3/4">
              <div className="docs-details shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 pb-11 sm:p-[20px] lg:mb-5 lg:px-8 xl:px-[55px] xl:py-[10px] dark:bg-black">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <MarkdownRenderer content={readmeDoc.content} className="doc-content" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MermaidProvider>
  );
}
