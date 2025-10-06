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
    const clubs = await database.all(`
      SELECT c.*, 
             GROUP_CONCAT(DISTINCT t.id) as trainer_ids,
             GROUP_CONCAT(DISTINCT d.id) as direction_ids
      FROM clubs c
      LEFT JOIN trainers t ON c.id = t.club_id
      LEFT JOIN directions d ON c.id = d.club_id
      GROUP BY c.id
    `);

    // Получаем детальную информацию для каждого клуба
    const clubsWithDetails = await Promise.all(
      (clubs as unknown[]).map(async (club) => {
        const c = club as Record<string, unknown>;
        const trainers = await database.all(
          'SELECT * FROM trainers WHERE club_id = ?',
          [c.id]
        );
        
        const directions = await database.all(
          'SELECT * FROM directions WHERE club_id = ?',
          [c.id]
        );

        return {
          ...c,
          trainers: (trainers as unknown[]).map((trainer) => {
            const t = trainer as Record<string, unknown>;
            return {
              ...t,
              certifications: t.certifications ? JSON.parse(t.certifications as string) : [],
              schedule: t.schedule ? JSON.parse(t.schedule as string) : []
            };
          }),
          directions: (directions as unknown[]).map((direction) => {
            const d = direction as Record<string, unknown>;
            return {
              ...d,
              schedule: d.schedule ? JSON.parse(d.schedule as string) : []
            };
          }),
          photos: c.photos ? JSON.parse(c.photos as string) : []
        };
      })
    );

    return NextResponse.json(clubsWithDetails);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных клубов' },
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
    const { id, name, address, phone, whatsapp, telegram, vk, instagram, description, photos } = data;

    await database.run(`
      INSERT INTO clubs (id, name, address, phone, whatsapp, telegram, vk, instagram, description, photos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, address, phone, whatsapp, telegram, vk, instagram, description, JSON.stringify(photos || [])]);

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating club:', error);
    return NextResponse.json(
      { error: 'Ошибка создания клуба' },
      { status: 500 }
    );
  }
}
