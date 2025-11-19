/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

interface MermaidProviderProps {
  children: React.ReactNode;
}

const MermaidProvider: React.FC<MermaidProviderProps> = ({ children }) => {
  useEffect(() => {
    // Load Mermaid script only on client side
    if (typeof window !== "undefined" && !window.mermaid) {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
      script.async = true;

      script.onload = () => {
        if (window.mermaid) {
          window.mermaid.initialize({
            startOnLoad: true,
            theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
            securityLevel: "loose",
            themeCSS: `
              .node rect,
              .node circle,
              .node ellipse,
              .node polygon {
                fill: hsl(var(--background));
                stroke: hsl(var(--muted-foreground));
                stroke-width: 2px;
              }
              .node .label {
                color: hsl(var(--foreground));
                font-family: system-ui, sans-serif;
              }
              .edgePath .path {
                stroke: hsl(var(--muted-foreground));
                stroke-width: 2px;
              }
              .edgeLabel {
                background-color: hsl(var(--background));
                color: hsl(var(--foreground));
              }
              .cluster rect {
                fill: hsl(var(--muted));
                stroke: hsl(var(--muted-foreground));
                stroke-width: 1px;
              }
              .titleText {
                fill: hsl(var(--foreground));
                font-size: 18px;
                font-weight: bold;
              }
            `,
          });

          // Re-initialize mermaid when theme changes
          const observer = new MutationObserver(() => {
            const isDark = document.documentElement.classList.contains("dark");
            if (window.mermaid) {
              window.mermaid.initialize({
                startOnLoad: true,
                theme: isDark ? "dark" : "default",
                securityLevel: "loose",
              });
              window.mermaid.init();
            }
          });

          observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return <>{children}</>;
};

declare global {
  interface Window {
    mermaid: any;
  }
}

export default MermaidProvider;
