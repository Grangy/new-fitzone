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
    const directions = await database.all(`
      SELECT d.*, c.name as club_name 
      FROM directions d 
      JOIN clubs c ON d.club_id = c.id
      ORDER BY d.title
    `);

    const directionsWithDetails = (directions as unknown[]).map((direction) => {
      const d = direction as Record<string, unknown>;
      return {
        ...d,
        schedule: d.schedule ? JSON.parse(d.schedule as string) : []
      };
    });

    return NextResponse.json(directionsWithDetails);
  } catch (error) {
    console.error('Error fetching directions:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных направлений' },
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
    const { id, club_id, title, description, image, price, duration, level, schedule, trainer } = data;

    await database.run(`
      INSERT INTO directions (id, club_id, title, description, image, price, duration, level, schedule, trainer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, club_id, title, description, image, price, duration, level, JSON.stringify(schedule || []), trainer]);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating direction:', error);
    return NextResponse.json(
      { error: 'Ошибка создания направления' },
      { status: 500 }
    );
  }
}
