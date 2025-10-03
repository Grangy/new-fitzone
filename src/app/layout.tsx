import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FitZone Новороссийск | Фитнес без клубной карты",
  description: "Современный фитнес-клуб в Новороссийске. Йога, пилатес, кроссфит, персональные тренировки. Плати только за то, что нужно тебе. Запись онлайн.",
  keywords: "фитнес, спортзал, йога, пилатес, кроссфит, тренировки, Новороссийск, персональный тренер",
  authors: [{ name: "FitZone" }],
  creator: "FitZone",
  publisher: "FitZone",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://fitzone-nsk.ru"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FitZone Новороссийск | Фитнес без клубной карты",
    description: "Современный фитнес-клуб в Новороссийске. Выбирай направления, тренеров и время — плати только за результат.",
    url: "https://fitzone-nsk.ru",
    siteName: "FitZone",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitZone - Фитнес без клубной карты",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FitZone Новороссийск | Фитнес без клубной карты",
    description: "Современный фитнес-клуб в Новороссийске. Выбирай направления, тренеров и время — плати только за результат.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        <meta name="theme-color" content="#f97316" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        
        {/* Google Analytics */}
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
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}

        {/* Yandex.Metrica */}
        <Script id="yandex-metrica" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(XXXXXX, "init", {
                 clickmap:true,
                 trackLinks:true,
                 accurateTrackBounce:true,
                 webvisor:true
            });
          `}
        </Script>
        
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsActivityLocation",
              "name": "FitZone",
              "image": "https://fitzone-nsk.ru/og-image.jpg",
              "description": "Современный фитнес-клуб в Новороссийске. Йога, пилатес, кроссфит, персональные тренировки.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "ул. Советов, 10",
                "addressLocality": "Новороссийск",
                "addressRegion": "Краснодарский край",
                "addressCountry": "RU"
              },
              "telephone": "+7 (8617) 123-45-67",
              "email": "info@fitzone-nsk.ru",
              "url": "https://fitzone-nsk.ru",
              "openingHours": "Mo-Su 06:00-23:00",
              "priceRange": "₽₽",
              "sameAs": [
                "https://instagram.com/fitzone_nsk",
                "https://vk.com/fitzone_nsk"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
