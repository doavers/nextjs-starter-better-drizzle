import fs from "fs";
import path from "path";

import matter from "gray-matter";
import { cache } from "react";

interface DocFile {
  slug: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  filePath: string;
  order?: number;
}

interface DocCategory {
  name: string;
  title: string;
  description?: string;
  files: DocFile[];
  order?: number;
}

const docsDirectory = path.join(process.cwd(), "docs");

// Define the order of categories
const categoryOrder: { [key: string]: number } = {
  "": 0, // Root README
  architecture: 1,
  "user-flows": 2,
  api: 3,
  database: 4,
  development: 5,
  deployment: 6,
};

// Define the order of files within categories
const fileOrder: { [key: string]: number } = {
  "README.md": 0,
  "PRD.md": 1,
  "system-architecture.md": 2,
  "authentication-flows.md": 1,
  "application-flows.md": 2,
  "api-documentation.md": 1,
  "schema-documentation.md": 1,
  "development-setup.md": 1,
  "deployment-guide.md": 1,
};

function extractTitleFromContent(content: string): string {
  // Try to extract h1 title
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1].trim();
  }

  // Try to extract title from frontmatter
  const titleMatch = content.match(/^title:\s*(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].replace(/['"]/g, "").trim();
  }

  // Fallback to filename
  return "Untitled";
}

function extractDescriptionFromContent(content: string): string | undefined {
  // Try to extract description from frontmatter
  const descMatch = content.match(/^description:\s*(.+)$/m);
  if (descMatch) {
    return descMatch[1].replace(/['"]/g, "").trim();
  }

  // Try to get first paragraph after h1
  const lines = content.split("\n").filter((line) => line.trim());
  const h1Index = lines.findIndex((line) => line.startsWith("# "));
  if (h1Index !== -1 && lines[h1Index + 1]) {
    const nextLine = lines[h1Index + 1].trim();
    if (nextLine && !nextLine.startsWith("#")) {
      return nextLine.length > 150 ? `${nextLine.substring(0, 150)}...` : nextLine;
    }
  }

  return undefined;
}

export const getAllDocFiles = cache((): DocFile[] => {
  const docFiles: DocFile[] = [];

  function readDirectory(dirPath: string, category: string = ""): void {
    try {
      const items = fs.readdirSync(dirPath);

      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          readDirectory(fullPath, category ? `${category}/${item}` : item);
        } else if (item.endsWith(".md")) {
          const fileContent = fs.readFileSync(fullPath, "utf8");
          const { data, content } = matter(fileContent);

          const relativePath = path.relative(docsDirectory, fullPath);
          const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

          const docFile: DocFile = {
            slug,
            title: data.title || extractTitleFromContent(content),
            description: data.description || extractDescriptionFromContent(content),
            content,
            category,
            filePath: fullPath,
            order: fileOrder[item] || 999,
          };

          docFiles.push(docFile);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }

  readDirectory(docsDirectory);

  return docFiles.sort((a, b) => {
    // First sort by category order
    const aCategoryOrder = categoryOrder[a.category] ?? 999;
    const bCategoryOrder = categoryOrder[b.category] ?? 999;

    if (aCategoryOrder !== bCategoryOrder) {
      return aCategoryOrder - bCategoryOrder;
    }

    // Then sort by file order within category
    if (a.order !== b.order) {
      return (a.order || 999) - (b.order || 999);
    }

    // Finally sort alphabetically
    return a.title.localeCompare(b.title);
  });
});

export const getDocCategories = cache((): DocCategory[] => {
  const docFiles = getAllDocFiles();
  const categoriesMap: { [key: string]: DocCategory } = {};

  for (const file of docFiles) {
    if (!categoriesMap[file.category]) {
      categoriesMap[file.category] = {
        name: file.category,
        title: getCategoryTitle(file.category),
        description: getCategoryDescription(file.category),
        files: [],
        order: categoryOrder[file.category] ?? 999,
      };
    }

    categoriesMap[file.category].files.push(file);
  }

  return Object.values(categoriesMap).sort((a, b) => (a.order || 999) - (b.order || 999));
});

function getCategoryTitle(category: string): string {
  const titles: { [key: string]: string } = {
    "": "Overview",
    architecture: "Architecture",
    "user-flows": "User Flows",
    api: "API Documentation",
    database: "Database",
    development: "Development",
    deployment: "Deployment",
  };

  return titles[category] || category;
}

function getCategoryDescription(category: string): string | undefined {
  const descriptions: { [key: string]: string } = {
    "": "Comprehensive documentation overview and quick start guide",
    architecture: "System architecture, components, and design patterns",
    "user-flows": "Complete user journey flows and interaction patterns",
    api: "REST API endpoints, request/response formats, and examples",
    database: "Database schema, relationships, and data management",
    development: "Development setup, tools, and best practices",
    deployment: "Production deployment and infrastructure guide",
  };

  return descriptions[category];
}

export const getDocBySlug = cache((slug: string): DocFile | null => {
  const docFiles = getAllDocFiles();
  return docFiles.find((doc) => doc.slug === slug) || null;
});

export { type DocFile, type DocCategory };
