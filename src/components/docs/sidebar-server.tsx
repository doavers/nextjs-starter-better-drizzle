import { getDocCategories } from "@/lib/docs-reader";

import SidebarClient from "./sidebar-client";

interface SidebarServerProps {
  currentSlug?: string;
}

export default function SidebarServer({ currentSlug }: SidebarServerProps) {
  const categories = getDocCategories();

  return <SidebarClient categories={categories} currentSlug={currentSlug} />;
}
