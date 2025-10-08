import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { siteConfig } from "../lib/siteConfig";
import AnalyticsOptimized from "../components/AnalyticsOptimized";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: siteConfig.site.title,
  description: siteConfig.site.description,
  keywords: siteConfig.site.keywords,
  authors: [{ name: siteConfig.site.author }],
  creator: siteConfig.site.creator,
  publisher: siteConfig.site.publisher,
  formatDetection: siteConfig.meta.formatDetection,
  metadataBase: new URL(siteConfig.site.url),
  alternates: {
    canonical: "/",
  },
  openGraph: siteConfig.meta.openGraph,
  twitter: siteConfig.meta.twitter,
  robots: siteConfig.meta.robots,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content={siteConfig.settings.themeColor} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            *{box-sizing:border-box}body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#333;background-color:#fff}.header{position:sticky;top:0;z-index:1000;background:rgba(255,255,255,0.95);backdrop-filter:blur(10px);border-bottom:1px solid rgba(0,0,0,0.1)}.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;text-align:center;padding:2rem}.hero h1{font-size:clamp(2rem,5vw,4rem);font-weight:700;margin-bottom:1rem;line-height:1.2}.hero p{font-size:clamp(1rem,2.5vw,1.5rem);margin-bottom:2rem;opacity:0.9}.btn{display:inline-block;padding:0.75rem 2rem;background:#ff6b35;color:white;text-decoration:none;border-radius:8px;font-weight:600;transition:all 0.3s ease;border:none;cursor:pointer}.btn:hover{background:#e55a2b;transform:translateY(-2px)}@media (max-width:768px){.hero{padding:1rem}.btn{padding:0.6rem 1.5rem;font-size:0.9rem}}
          `
        }} />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
        <link rel="preload" href="/images/hero-bg.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/promo.jpg" as="image" type="image/jpeg" />
        
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//mc.yandex.ru" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <AnalyticsOptimized>
          {children}
        </AnalyticsOptimized>
        
        {/* Google Analytics - Optimized */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}
        
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteConfig.structuredData)
          }}
        />
      </body>
    </html>
  );
}
