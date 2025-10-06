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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const club = await database.get('SELECT * FROM clubs WHERE id = ?', [id]);
    
    if (!club) {
      return NextResponse.json(
        { error: 'Клуб не найден' },
        { status: 404 }
      );
    }

    const trainers = await database.all(
      'SELECT * FROM trainers WHERE club_id = ?',
      [id]
    );
    
    const directions = await database.all(
      'SELECT * FROM directions WHERE club_id = ?',
      [id]
    );

    const clubWithDetails = {
      ...(club as Record<string, unknown>),
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
      photos: (club as Record<string, unknown>).photos ? JSON.parse((club as Record<string, unknown>).photos as string) : []
    };

    return NextResponse.json(clubWithDetails);
  } catch (error) {
    console.error('Error fetching club:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных клуба' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { name, address, phone, whatsapp, telegram, vk, instagram, description, photos } = data;

    await database.run(`
      UPDATE clubs 
      SET name = ?, address = ?, phone = ?, whatsapp = ?, telegram = ?, vk = ?, instagram = ?, description = ?, photos = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, address, phone, whatsapp, telegram, vk, instagram, description, JSON.stringify(photos || []), id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating club:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления клуба' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Необходима аутентификация' },
        { status: 401 }
      );
    }

    await database.run('DELETE FROM clubs WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting club:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления клуба' },
      { status: 500 }
    );
  }
}
