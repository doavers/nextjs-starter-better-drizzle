import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import * as React from "react";

import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
import { AUTH_CONFIG } from "@/config/auth-config";
import { UserRole } from "@/config/role-config";
import { auth } from "@/lib/auth";
import { getPreference } from "@/lib/cookie";
import { PreferencesStoreProvider } from "@/stores/preferences/preferences-provider";
import { THEME_MODE_VALUES, THEME_PRESET_VALUES, type ThemeMode, type ThemePreset } from "@/types/preferences/theme";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.meta.title,
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session ||
    [UserRole.SUPERADMIN as string, UserRole.ADMIN as string, UserRole.USER].indexOf(session.user.role ?? "") < 0
  ) {
    redirect(AUTH_CONFIG.loginPage);
  }

  return (
    <html
      lang="en"
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <NextTopLoader showSpinner={false} />
        <NuqsAdapter>
          <QueryProvider>
            <NextIntlClientProvider>
              <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
                {children}
                <Toaster />

                <Analytics />
                <SpeedInsights />
              </PreferencesStoreProvider>
            </NextIntlClientProvider>
          </QueryProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
