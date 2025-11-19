import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import * as React from "react";

import { Toaster } from "@/components/ui/sonner";
import { APP_CONFIG } from "@/config/app-config";
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

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    template: `%s | ${APP_CONFIG.meta.title}`,
    default: APP_CONFIG.meta.title, // a default is required when creating a template
  },
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeMode = await getPreference<ThemeMode>("theme_mode", THEME_MODE_VALUES, "light");
  const themePreset = await getPreference<ThemePreset>("theme_preset", THEME_PRESET_VALUES, "default");

  return (
    <html
      lang="en"
      className={themeMode === "dark" ? "dark" : ""}
      data-theme-preset={themePreset}
      suppressHydrationWarning
    >
      <head>
        {/* Google Analytics Script */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-HSTW116NBB${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
        {/* Google Adsense Script */}
        {/* <meta name="google-adsense-account" content={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID} />
        <Script
          id="Absense-banner"
          async
          strategy="afterInteractive"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID}`}
          crossOrigin="anonymous"
        /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <PreferencesStoreProvider themeMode={themeMode} themePreset={themePreset}>
          <NextIntlClientProvider>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </PreferencesStoreProvider>
      </body>
    </html>
  );
}
