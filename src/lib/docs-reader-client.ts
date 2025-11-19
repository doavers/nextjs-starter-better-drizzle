// Client-side docs reader - receives data from server components
export interface DocFile {
  slug: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  filePath: string;
  order?: number;
}

export interface DocCategory {
  name: string;
  title: string;
  description?: string;
  files: DocFile[];
  order?: number;
}

// These functions will receive data from server components
export function createSidebarClient(docCategories: DocCategory[]) {
  return docCategories;
}

export function createDocClient(doc: DocFile | null) {
  return doc;
}
