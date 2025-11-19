"use client";

import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

import { QueryProvider } from "@/components/providers/query-provider";

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" enableSystem={false} defaultTheme="light">
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
