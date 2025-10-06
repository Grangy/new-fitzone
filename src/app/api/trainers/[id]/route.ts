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
    const trainer = await database.get('SELECT * FROM trainers WHERE id = ?', [id]);
    
    if (!trainer) {
      return NextResponse.json(
        { error: 'Тренер не найден' },
        { status: 404 }
      );
    }

    const trainerWithDetails = {
      ...(trainer as Record<string, unknown>),
      certifications: (trainer as Record<string, unknown>).certifications ? JSON.parse((trainer as Record<string, unknown>).certifications as string) : [],
      schedule: (trainer as Record<string, unknown>).schedule ? JSON.parse((trainer as Record<string, unknown>).schedule as string) : []
    };

    return NextResponse.json(trainerWithDetails);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    return NextResponse.json(
      { error: 'Ошибка получения данных тренера' },
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
    const { club_id, name, specialty, experience, image, certifications, bio, schedule } = data;

    await database.run(`
      UPDATE trainers 
      SET club_id = ?, name = ?, specialty = ?, experience = ?, image = ?, certifications = ?, bio = ?, schedule = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [club_id, name, specialty, experience, image, JSON.stringify(certifications || []), bio, JSON.stringify(schedule || []), id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating trainer:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления тренера' },
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

    await database.run('DELETE FROM trainers WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления тренера' },
      { status: 500 }
    );
  }
}
