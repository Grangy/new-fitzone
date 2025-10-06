'use client';

import { useState, useEffect } from 'react';

interface SiteConfig {
  site: {
    name: string;
    title: string;
    description: string;
    keywords: string;
    url: string;
    locale: string;
    author: string;
    creator: string;
    publisher: string;
  };
  meta: {
    robots: string;
    openGraph: {
      title: string;
      description: string;
      url: string;
      siteName: string;
      images: Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
      locale: string;
      type: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
      images: string[];
    };
    formatDetection: {
      email: boolean;
      address: boolean;
      telephone: boolean;
    };
  };
  structuredData: {
    "@context": string;
    "@type": string;
    name: string;
    image: string;
    description: string;
    address: {
      "@type": string;
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      addressCountry: string;
    };
    telephone: string;
    email: string;
    url: string;
    openingHours: string;
    priceRange: string;
    sameAs: string[];
  };
  banners: {
    promo: {
      image: string;
      alt: string;
      aspectRatio: string;
    };
    hero: {
      backgroundImage: string;
    };
  };
  video: {
    hero: {
      src: string;
      poster: string;
      autoplay: boolean;
    };
  };
  schedules: Record<string, {
    title: string;
    trainer: string;
    schedule: Array<{
      day: string;
      time: string;
      level: string;
    }>;
  }>;
  settings: {
    themeColor: string;
    defaultClub: string;
    autoPlayVideo: boolean;
    showPromoBanner: boolean;
    enableQuiz: boolean;
  };
  contacts: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
  };
  social: {
    instagram: string;
    vk: string;
    telegram: string;
    whatsapp: string;
  };
}

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/public/site-config');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        } else {
          // Fallback к статической конфигурации
          const { siteConfig } = await import('../lib/siteConfig');
          setConfig(siteConfig);
        }
      } catch (error) {
        console.error('Error fetching site config:', error);
        // Fallback к статической конфигурации
        const { siteConfig } = await import('../lib/siteConfig');
        setConfig(siteConfig);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
}
