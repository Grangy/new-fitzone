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
    const trainers = await database.all(`
      SELECT t.*, c.name as club_name 
      FROM trainers t 
      JOIN clubs c ON t.club_id = c.id
      ORDER BY t.name
    `);

    const trainersWithDetails = (trainers as unknown[]).map((trainer) => {
      const t = trainer as Record<string, unknown>;
      return {
        ...t,
        certifications: t.certifications ? JSON.parse(t.certifications as string) : [],
        schedule: t.schedule ? JSON.parse(t.schedule as string) : []
      };
    });

    return NextResponse.json(trainersWithDetails);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных тренеров' },
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
    const { id, club_id, name, specialty, experience, image, certifications, bio, schedule } = data;

    await database.run(`
      INSERT INTO trainers (id, club_id, name, specialty, experience, image, certifications, bio, schedule)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, club_id, name, specialty, experience, image, JSON.stringify(certifications || []), bio, JSON.stringify(schedule || [])]);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating trainer:', error);
    return NextResponse.json(
      { error: 'Ошибка создания тренера' },
      { status: 500 }
    );
  }
}
