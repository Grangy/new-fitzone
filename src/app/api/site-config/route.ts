import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

async function authenticateRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

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

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Обновляем или создаем каждую конфигурацию
    for (const [key, value] of Object.entries(data)) {
      const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
      
      await database.run(`
        INSERT OR REPLACE INTO site_config (key, value, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
      `, [key, valueStr]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating site config:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления конфигурации сайта' },
      { status: 500 }
    );
  }
}
