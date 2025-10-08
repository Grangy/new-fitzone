// Оптимизация загрузки ресурсов
export const loadScript = (src: string, callback?: () => void) => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => {
      callback?.();
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const loadCSS = (href: string) => {
  return new Promise<void>((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = reject;
    document.head.appendChild(link);
  });
};

// Lazy load Yandex Metrica
export const loadYandexMetrica = (id: string) => {
  if (typeof window === 'undefined') return;
  
  // Проверяем, не загружен ли уже скрипт
  if (typeof window.ym === 'function') return;
  
  const script = document.createElement('script');
  script.src = `https://mc.yandex.ru/metrika/tag.js`;
  script.async = true;
  script.onload = () => {
    window.ym(id, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: false
    });
  };
  document.head.appendChild(script);
};

// Intersection Observer для lazy loading
export const observeElement = (
  element: Element,
  callback: () => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === 'undefined') return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }
  );
  
  observer.observe(element);
  return observer;
};

// Debounce функция для оптимизации событий
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle функция для оптимизации событий
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
