"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { getDocCategories } from "@/lib/docs-reader";
import { cn } from "@/lib/utils";

const SidebarLink = () => {
  const pathUrl = usePathname();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set([""]));

  const categories = getDocCategories();

  const toggleCategory = (categoryName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName);
    } else {
      newExpanded.add(categoryName);
    }
    setExpandedCategories(newExpanded);
  };

  const isDocActive = (slug: string) => {
    return pathUrl === `/docs/${slug}` || (slug === "README" && pathUrl === "/docs");
  };

  return (
    <>
      {categories.map((category) => (
        <li key={category.name} className="block">
          {category.files.length > 1 && (
            <button
              onClick={() => toggleCategory(category.name)}
              className={cn(
                "hover:text-primary flex w-full items-center justify-between rounded-sm px-3 py-2 text-base font-medium",
                expandedCategories.has(category.name)
                  ? "text-primary bg-slate-100 dark:bg-gray-800"
                  : "text-black dark:text-white",
              )}
            >
              <span>{category.title}</span>
              {expandedCategories.has(category.name) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          {(expandedCategories.has(category.name) || category.files.length === 1) && (
            <ul className={cn("space-y-1", category.files.length > 1 && "mt-1 ml-2")}>
              {category.files.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={doc.slug === "README" ? "/docs" : `/docs/${doc.slug}`}
                    className={cn(
                      isDocActive(doc.slug)
                        ? "text-primary hover:text-primary bg-slate-200 dark:bg-black dark:text-yellow-500"
                        : "hover:text-primary text-black dark:text-white",
                      `flex w-full rounded-sm px-3 py-2 text-sm`,
                      category.files.length === 1 && "text-base font-medium",
                    )}
                  >
                    {doc.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </>
  );
};

export default SidebarLink;
