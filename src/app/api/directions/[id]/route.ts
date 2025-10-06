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
    const direction = await database.get('SELECT * FROM directions WHERE id = ?', [id]);
    
    if (!direction) {
      return NextResponse.json(
        { error: 'Направление не найдено' },
        { status: 404 }
      );
    }

    const directionWithDetails = {
      ...direction,
      schedule: (direction as { schedule?: string }).schedule ? JSON.parse((direction as { schedule: string }).schedule) : []
    };

    return NextResponse.json(directionWithDetails);
  } catch (error) {
    console.error('Error fetching direction:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных направления' },
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
    const { club_id, title, description, image, price, duration, level, schedule, trainer } = data;

    await database.run(`
      UPDATE directions 
      SET club_id = ?, title = ?, description = ?, image = ?, price = ?, duration = ?, level = ?, schedule = ?, trainer = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [club_id, title, description, image, price, duration, level, JSON.stringify(schedule || []), trainer, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating direction:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления направления' },
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

    await database.run('DELETE FROM directions WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting direction:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления направления' },
      { status: 500 }
    );
  }
}
