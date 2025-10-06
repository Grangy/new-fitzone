import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';

export async function GET() {
  try {
    const recommendations = await database.all(`
      SELECT * FROM quiz_recommendations 
      WHERE is_active = 1 
      ORDER BY priority DESC, created_at DESC
    `);

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const result = await database.run(
      `INSERT INTO quiz_recommendations 
       (name, description, conditions, trainer_ids, direction_ids, club_ids, priority) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name, 
        description, 
        JSON.stringify(conditions), 
        JSON.stringify(trainer_ids), 
        JSON.stringify(direction_ids), 
        JSON.stringify(club_ids), 
        priority
      ]
    );

    return NextResponse.json({ id: result.lastID, success: true });
  } catch (error) {
    console.error('Error creating recommendation:', error);
    return NextResponse.json({ error: 'Failed to create recommendation' }, { status: 500 });
  }
}
