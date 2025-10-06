import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const recommendation = await database.get(
      'SELECT * FROM quiz_recommendations WHERE id = ? AND is_active = 1',
      [id]
    );

    if (!recommendation) {
      return NextResponse.json({ error: 'Recommendation not found' }, { status: 404 });
    }

    // Парсим JSON поля
    const rec = recommendation as {
      conditions: string;
      trainer_ids: string;
      direction_ids: string;
      club_ids: string;
    };
    
    const formattedRecommendation = {
      ...recommendation,
      conditions: JSON.parse(rec.conditions),
      trainer_ids: JSON.parse(rec.trainer_ids || '[]'),
      direction_ids: JSON.parse(rec.direction_ids || '[]'),
      club_ids: JSON.parse(rec.club_ids || '[]')
    };

    return NextResponse.json(formattedRecommendation);
  } catch (error) {
    console.error('Error fetching recommendation:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendation' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { 
      name, 
      description, 
      conditions, 
      trainer_ids = [], 
      direction_ids = [], 
      club_ids = [], 
      priority = 1 
    } = await request.json();

    if (!name || !description || !conditions) {
      return NextResponse.json({ error: 'Name, description and conditions are required' }, { status: 400 });
    }

    await database.run(
      `UPDATE quiz_recommendations SET 
       name = ?, description = ?, conditions = ?, trainer_ids = ?, 
       direction_ids = ?, club_ids = ?, priority = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [
        name, 
        description, 
        JSON.stringify(conditions), 
        JSON.stringify(trainer_ids), 
        JSON.stringify(direction_ids), 
        JSON.stringify(club_ids), 
        priority, 
        id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json({ error: 'Failed to update recommendation' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await database.run(
      'UPDATE quiz_recommendations SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting recommendation:', error);
    return NextResponse.json({ error: 'Failed to delete recommendation' }, { status: 500 });
  }
}
