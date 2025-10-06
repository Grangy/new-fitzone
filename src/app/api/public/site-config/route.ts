import { NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const configs = await database.all('SELECT * FROM site_config ORDER BY key');
    
    // Преобразуем в объект для удобства
    const configObject: Record<string, unknown> = {};
    (configs as unknown[]).forEach((config) => {
      const c = config as Record<string, unknown>;
      try {
        configObject[c.key as string] = JSON.parse(c.value as string);
      } catch {
        configObject[c.key as string] = c.value;
      }
    });

    return NextResponse.json(configObject);
  } catch (error) {
    console.error('Error fetching site config:', error);
    return NextResponse.json(
      { error: 'Ошибка получения конфигурации сайта' },
      { status: 500 }
    );
  }
}
