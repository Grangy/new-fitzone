import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function POST() {
  try {
    await initializeDatabase();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { error: 'Ошибка инициализации базы данных' },
      { status: 500 }
    );
  }
}
