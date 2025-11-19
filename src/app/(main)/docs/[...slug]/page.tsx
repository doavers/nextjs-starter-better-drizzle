import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import MarkdownRenderer from "@/components/docs/markdown-renderer";
import MermaidProvider from "@/components/docs/mermaid-provider";
import SidebarServer from "@/components/docs/sidebar-server";
import { APP_CONFIG } from "@/config/app-config";
import { getDocBySlug, getAllDocFiles } from "@/lib/docs-reader";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const docFiles = getAllDocFiles();

  return docFiles
    .filter((doc) => doc.slug !== "README") // Skip README as it's handled by the main docs page
    .map((doc) => ({
      slug: doc.slug.split("/"), // Split nested paths into array
    }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/"); // Join array back to string
  const doc = getDocBySlug(slug);

  if (!doc) {
    return {
      title: `Documentation Not Found | ${APP_CONFIG.meta.title}`,
      description: "The requested documentation page could not be found.",
    };
  }

  return {
    title: `${doc.title} | Documentation | ${APP_CONFIG.meta.title}`,
    description: doc.description || `${doc.title} - ${APP_CONFIG.meta.title} Documentation`,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug.join("/"); // Join array back to string
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  return (
    <MermaidProvider>
      <section className="pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            {/* Sidebar */}
            <div className="w-full px-4 lg:w-1/4">
              <div className="shadow-solid-4 dark:border-strokedark dark:bg-blacksection sticky top-[74px] rounded-lg border border-white p-4 transition-all">
                <div className="mb-4">
                  <Link href="/docs" className="text-primary hover:text-primary flex items-center text-sm font-medium">
                    ← Back to Documentation
                  </Link>
                </div>
                <ul className="space-y-2">
                  <SidebarServer currentSlug={slug} />
                </ul>
              </div>
            </div>

            {/* Main Content */}
            <div className="w-full px-4 lg:w-3/4">
              <div className="docs-details shadow-three dark:bg-gray-dark rounded-sm bg-white px-8 pb-11 sm:p-[20px] lg:mb-5 lg:px-8 xl:px-[55px] xl:py-[20px] dark:bg-black">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                  <ol className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <li>
                      <Link href="/docs" className="hover:text-primary">
                        Documentation
                      </Link>
                    </li>
                    <li>/</li>
                    <li className="text-gray-900 dark:text-white">{doc.title}</li>
                  </ol>
                </nav>

                {/* Document Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <MarkdownRenderer content={doc.content} className="doc-content" />
                </div>

                {/* Navigation */}
                <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <DocNavigation currentSlug={slug} direction="prev" />
                    <DocNavigation currentSlug={slug} direction="next" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MermaidProvider>
  );
}

function DocNavigation({ currentSlug, direction }: { currentSlug: string; direction: "prev" | "next" }) {
  const docFiles = getAllDocFiles();
  const currentIndex = docFiles.findIndex((doc) => doc.slug === currentSlug);

  if (currentIndex === -1) return null;

  let targetDoc;
  if (direction === "prev") {
    targetDoc = currentIndex > 0 ? docFiles[currentIndex - 1] : null;
  } else {
    targetDoc = currentIndex < docFiles.length - 1 ? docFiles[currentIndex + 1] : null;
  }

  if (!targetDoc) return null;

  const href = targetDoc.slug === "README" ? "/docs" : `/docs/${targetDoc.slug}`;
  const label = direction === "prev" ? "← Previous" : "Next →";

  return (
    <Link href={href} className="text-primary hover:text-primary/80 flex items-center space-x-2 font-medium">
      {direction === "prev" && <span>{label}</span>}
      <span>{targetDoc.title}</span>
      {direction === "next" && <span>{label}</span>}
    </Link>
  );
}
