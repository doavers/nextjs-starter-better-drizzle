/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";

import { CodeBlockWithCopy } from "./code-block-with-copy";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  useEffect(() => {
    // Process mermaid diagrams after component mounts
    if (typeof window !== "undefined" && (window as any).mermaid) {
      (window as any).mermaid.init();
    }
  }, [content]);

  const processMarkdown = (markdown: string): string => {
    let processed = markdown;

    // Process mermaid diagrams first
    processed = processed.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
      return `<div class="mermaid">${diagram.trim()}</div>`;
    });

    // Process code blocks
    processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || "text";
      // Don't render code blocks as HTML here - handle them separately
      return `<!--CODE_BLOCK:${language}:${encodeURIComponent(code.trim())}-->`;
    });

    // Process headers
    processed = processed.replace(
      /^#### (.+)$/gm,
      '<h4 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">$1</h4>',
    );
    processed = processed.replace(
      /^### (.+)$/gm,
      '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">$1</h3>',
    );
    processed = processed.replace(
      /^## (.+)$/gm,
      '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">$1</h2>',
    );
    processed = processed.replace(
      /^# (.+)$/gm,
      '<h1 class="text-3xl font-bold mt-8 mb-6 text-gray-900 dark:text-white">$1</h1>',
    );

    // Process bold text
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // Process italic text
    processed = processed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');

    // Process inline code
    processed = processed.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-gray-800 dark:text-gray-200">$1</code>',
    );

    // Process links
    processed = processed.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>',
    );

    // Process single line breaks within text (for hard breaks)
    processed = processed.replace(/([^\n])\n([^\n])/g, "$1<br />$2");

    // Process double line breaks for paragraphs
    processed = processed.replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 dark:text-gray-300">');
    processed = `<p class="mb-4 text-gray-700 dark:text-gray-300">${processed}</p>`;

    // Process lists
    processed = processed.replace(/^\* (.+)$/gm, '<li class="ml-4 mb-2">• $1</li>');
    processed = processed.replace(/(<li[\s\S]*?<\/li>)/g, '<ul class="list-disc list-inside mb-4">$1</ul>');

    // Process numbered lists
    processed = processed.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-2">$1</li>');
    processed = processed.replace(/(<li[\s\S]*?<\/li>)/g, '<ol class="list-decimal list-inside mb-4">$1</ol>');

    // Process blockquotes
    processed = processed.replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4">$1</blockquote>',
    );

    // Process tables
    processed = processed.replace(/\|(.+)\|/g, (match, content) => {
      const cells = content.split("|").map((cell: string) => cell.trim());
      const rowHtml = cells
        .map((cell: any) => `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2">${cell}</td>`)
        .join("");
      return `<tr>${rowHtml}</tr>`;
    });
    processed = processed.replace(
      /(<tr>[\s\S]*?<\/tr>)/g,
      '<table class="w-full border-collapse border border-gray-300 dark:border-gray-600 my-4">$1</table>',
    );

    return processed;
  };

  const renderContent = (content: string) => {
    const processedContent = processMarkdown(content);

    // Split content by code blocks and render them separately
    const parts = processedContent.split(/<!--CODE_BLOCK:(\w+):([^>]+)-->/);

    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i % 3 === 0) {
        // Regular HTML content
        if (part) {
          elements.push(<div key={`text-${i}`} dangerouslySetInnerHTML={{ __html: part }} />);
        }
      } else if (i % 3 === 1) {
        // Language
        const language = part;
        const encodedCode = parts[i + 1];
        const code = decodeURIComponent(encodedCode);

        elements.push(
          <div key={`code-${i}`} className="my-4">
            <CodeBlockWithCopy language={language} code={code} />
          </div>,
        );

        i++; // Skip the encoded code part
      }
    }

    return elements;
  };

  return <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>{renderContent(content)}</div>;
};

export default MarkdownRenderer;
