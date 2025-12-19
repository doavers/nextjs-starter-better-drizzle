import "@/app/globals.css";
import "@/styles/frontend/index.css";
import "@/styles/frontend/prism-vsc-dark-plus.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import React from "react";

import ChatWidget from "@/components/common/chat-widget";
import ScrollToTop from "@/components/main/common/scroll-to-top";
import Footer from "@/components/main/footer/footer";
import Header from "@/components/main/header/header-two";
import { APP_CONFIG } from "@/config/app-config";
import { AUTH_CONFIG } from "@/config/auth-config";
import { auth } from "@/lib/auth";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(AUTH_CONFIG.loginPage);
  }

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
          <NextIntlClientProvider>
            <div className="isolate">
              <Header />

              {children}

              <Footer />
              <ChatWidget />
              <ScrollToTop />

              <Analytics />
              <SpeedInsights />
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
