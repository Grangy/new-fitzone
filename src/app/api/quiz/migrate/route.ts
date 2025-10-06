import { NextResponse } from 'next/server';
import { migrateQuizData } from '@/scripts/migrate-quiz-data';

export async function POST() {
  try {
    await migrateQuizData();
    return NextResponse.json({ success: true, message: 'Quiz data migrated successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: 'Failed to migrate quiz data' },
      { status: 500 }
    );
  }
}
