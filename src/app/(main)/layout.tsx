import "@/app/globals.css";
import "@/styles/frontend/index.css";
import "@/styles/frontend/prism-vsc-dark-plus.css";

import { Metadata } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import React from "react";

import ChatWidget from "@/components/common/chat-widget";
import ScrollToTop from "@/components/main/common/scroll-to-top";
import Footer from "@/components/main/footer/footer";
import Header from "@/components/main/header/header-two";
import { APP_CONFIG } from "@/config/app-config";

import Providers from "./providers";

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: {
    template: `%s | ${APP_CONFIG.meta.title}`,
    default: APP_CONFIG.meta.title, // a default is required when creating a template
  },
  description: APP_CONFIG.meta.description,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html suppressHydrationWarning className="scroll-smooth!" lang={locale}>
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
      <body>
        <Providers>
          <NextIntlClientProvider locale={locale}>
            <div className="isolate">
              <Header />

              {children}

              <Footer />
              <ChatWidget />
              <ScrollToTop />
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
