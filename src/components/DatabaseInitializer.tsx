'use client';

import { useEffect } from 'react';

export default function DatabaseInitializer() {
  useEffect(() => {
    // Инициализируем базу данных при загрузке приложения
    const initDb = async () => {
      try {
        await fetch('/api/init-db', { method: 'POST' });
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initDb();
  }, []);

  return null;
}
