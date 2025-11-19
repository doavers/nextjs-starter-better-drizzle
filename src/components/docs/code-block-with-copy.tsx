"use client";

import { Copy, Check } from "lucide-react";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { Button } from "@/components/ui/button";

interface CodeBlockWithCopyProps {
  language: string;
  code: string;
  className?: string;
}

export const CodeBlockWithCopy: React.FC<CodeBlockWithCopyProps> = ({ language, code, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy code:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Fallback copy failed:", err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className={`group relative ${className}`}>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          paddingRight: "3.5rem", // Add padding to make room for the copy button
        }}
      >
        {code}
      </SyntaxHighlighter>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-8 w-8 bg-gray-800 p-0 text-gray-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:bg-gray-700 hover:text-white"
        aria-label={copied ? "Copied!" : "Copy code"}
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};
