// Единый конфигурационный файл сайта
export const siteConfig = {
  // Основная информация о сайте
  site: {
    name: "FitZone",
    title: "FitZone Новороссийск | Фитнес без клубной карты",
    description: "Современный фитнес-клуб в Новороссийске. Йога, пилатес, кроссфит, персональные тренировки. Плати только за то, что нужно тебе. Запись онлайн.",
    keywords: "фитнес, спортзал, йога, пилатес, кроссфит, тренировки, Новороссийск, персональный тренер",
    url: "https://fitzone-nsk.ru",
    locale: "ru_RU",
    author: "FitZone",
    creator: "FitZone",
    publisher: "FitZone",
  },

  // Метатеги для SEO
  meta: {
    robots: "index, follow",
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
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  },

  // Структурированные данные
  structuredData: {
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
  },

  // Баннеры и промо-материалы
  banners: {
    promo: {
      image: "/images/promo.jpg",
      alt: "FitZone Promo",
      aspectRatio: "32/9" as const,
    },
    hero: {
      backgroundImage: "/images/hero-bg.jpg",
    }
  },

  // Видео контент
  video: {
    hero: {
      src: "/video.mp4",
      poster: "/video-poster.jpg",
      autoplay: true,
    }
  },

  // Расписание тренировок (тестовые данные)
  schedules: {
    "yoga-pionerskaya": {
      title: "Йога",
      trainer: "Анна Петрова",
      schedule: [
        { day: "Понедельник", time: "09:00-10:00", level: "Начинающий" },
        { day: "Среда", time: "09:00-10:00", level: "Средний" },
        { day: "Пятница", time: "09:00-10:00", level: "Продвинутый" },
        { day: "Вторник", time: "18:00-19:00", level: "Восстановительная" },
        { day: "Четверг", time: "18:00-19:00", level: "Восстановительная" },
      ]
    },
    "crossfit-pionerskaya": {
      title: "Кроссфит",
      trainer: "Дмитрий Волков",
      schedule: [
        { day: "Понедельник", time: "07:00-08:00", level: "Средний" },
        { day: "Среда", time: "07:00-08:00", level: "Продвинутый" },
        { day: "Пятница", time: "07:00-08:00", level: "Средний" },
        { day: "Вторник", time: "19:00-20:00", level: "Продвинутый" },
        { day: "Четверг", time: "19:00-20:00", level: "Средний" },
      ]
    },
    "pilates-mira": {
      title: "Пилатес",
      trainer: "Михаил Козлов",
      schedule: [
        { day: "Понедельник", time: "10:00-11:00", level: "Начинающий" },
        { day: "Среда", time: "10:00-11:00", level: "Средний" },
        { day: "Пятница", time: "10:00-11:00", level: "Начинающий" },
        { day: "Вторник", time: "17:00-18:00", level: "Средний" },
        { day: "Четверг", time: "17:00-18:00", level: "Продвинутый" },
      ]
    },
    "personal-mira": {
      title: "Персональные тренировки",
      trainer: "Елена Смирнова",
      schedule: [
        { day: "Понедельник", time: "08:00-20:00", level: "Любой" },
        { day: "Вторник", time: "08:00-20:00", level: "Любой" },
        { day: "Среда", time: "08:00-20:00", level: "Любой" },
        { day: "Четверг", time: "08:00-20:00", level: "Любой" },
        { day: "Пятница", time: "08:00-20:00", level: "Любой" },
        { day: "Суббота", time: "09:00-15:00", level: "Любой" },
      ]
    }
  },

  // Общие настройки
  settings: {
    themeColor: "#f97316",
    defaultClub: "pionerskaya",
    autoPlayVideo: true,
    showPromoBanner: true,
    enableQuiz: true,
  },

  // Контакты
  contacts: {
    phone: "+7 (8617) 123-45-67",
    email: "info@fitzone-nsk.ru",
    address: "ул. Советов, 10, Новороссийск",
    workingHours: "06:00 - 23:00 (ежедневно)",
  },

  // Социальные сети
  social: {
    instagram: "https://instagram.com/fitzone_nsk",
    vk: "https://vk.com/fitzone_nsk",
    telegram: "https://t.me/fitzone_nsk",
    whatsapp: "https://wa.me/786171234567",
  }
}

export type SiteConfig = typeof siteConfig
